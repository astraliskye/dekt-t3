import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { CardWithEffects, DeckWithCards } from "../types/client";
import { trpc } from "../utils/trpc";
import Button from "./button";
import CardCollection from "./card-collection";
import CardList from "./card-list";
import TextInput from "./text-input";

interface DeckBuilderProps {
  deck?: DeckWithCards;
}

function cardMapFromArray(
  cards: CardWithEffects[]
): Map<string, CardWithEffects> {
  const result = new Map<string, CardWithEffects>();

  cards.forEach((card) => {
    result.set(card.id, card);
  });

  return result;
}

function tagSetFromArray(tagIds: string[]): Set<string> {
  const result = new Set<string>();

  tagIds.forEach((tagId) => {
    result.add(tagId);
  });

  return result;
}

const DeckBuilder = ({ deck }: DeckBuilderProps) => {
  const router = useRouter();

  // Session and queries
  const { data: session } = useSession();
  const { data: tags } = trpc.useQuery(["tag.all"]);
  const createDeckMutation = trpc.useMutation(["deck.create"]);
  const updateDeckMutation = trpc.useMutation(["deck.update"]);

  // State
  const [deckName, setDeckName] = useState(deck ? deck.name : "");
  const [deckDescription, setDeckDescription] = useState<string>(
    deck && deck.description ? deck.description : ""
  );
  const [deckCards, setDeckCards] = useState<Map<string, CardWithEffects>>(
    deck ? cardMapFromArray(deck.cards) : new Map<string, CardWithEffects>()
  );
  const [deckTags, setDeckTags] = useState<Set<string>>(
    deck ? tagSetFromArray(deck.tags.map((tag) => tag.id)) : new Set<string>()
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (session && session.user) {
      if (deck) {
        try {
          await updateDeckMutation.mutateAsync({
            id: deck.id,
            name: deckName,
            description: deckDescription,
            cards: [...deckCards.keys()],
            tags: [...deckTags.values()],
          });

          router.push(`/decks/${deck.id}`);
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          await createDeckMutation.mutateAsync({
            name: deckName,
            description: deckDescription,
            creator: session.user.id,
            cards: [...deckCards.keys()],
            tags: [...deckTags.values()],
          });

          router.push("/decks");
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      signIn("discord");
    }
  }

  function addCardToDeck(card: CardWithEffects) {
    if (deckCards.has(card.id)) {
      deckCards.delete(card.id);
      setDeckCards(new Map(deckCards));
    } else {
      setDeckCards(new Map(deckCards.set(card.id, card)));
    }
  }

  function removeCardFromDeck(cardId: string) {
    deckCards.delete(cardId);
    setDeckCards(new Map(deckCards));
  }

  return (
    <>
      <h1 className="text-5xl text-center pt-16 pb-8">Deck Builder</h1>
      <h2 className="text-center text-3xl">Deck Info</h2>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col w-96 mx-auto h-36 justify-around"
      >
        <TextInput
          placeholder="Deck name"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
        />
        <TextInput
          placeholder="Deck description"
          value={deckDescription}
          onChange={(e) => setDeckDescription(e.target.value)}
        />
        <Button submit={true}>{deck ? "Update Deck" : "Create Deck"}</Button>
      </form>

      {tags && (
        <div className="flex flex-wrap justify-center py-4 px-4">
          {tags.map((tag) => (
            <button
              key={tag.id}
              className={`cursor-pointer ${
                deckTags.has(tag.id)
                  ? "bg-red-700 border border-transparent"
                  : "bg-transparent border border-red-700"
              } rounded-md mx-1 px-2 py-1 text-sm font-bold mb-3`}
              onClick={() => {
                if (deckTags.has(tag.id)) {
                  deckTags.delete(tag.id);
                  setDeckTags(new Set(deckTags));
                } else {
                  deckTags.add(tag.id);
                  setDeckTags(new Set(deckTags));
                }
              }}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}

      {[...deckCards.values()].length > 0 && (
        <CardList
          cards={[...deckCards.values()]}
          removeCard={removeCardFromDeck}
        />
      )}

      <CardCollection deckCards={deckCards} addCardToDeck={addCardToDeck} />
    </>
  );
};

export default DeckBuilder;
