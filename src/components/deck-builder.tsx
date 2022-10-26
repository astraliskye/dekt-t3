import { triggerAsyncId } from "async_hooks";
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

interface Stat {
  name: string;
  amount: number;
  percent: boolean;
}

function getSecondaryEffectsFromCardMap(
  deckCards: Map<string, CardWithEffects>
): string[] {
  const secondaryEffects = new Set<string>();

  Array.from(deckCards.values()).forEach((card) => {
    card.secondaryEffects.forEach((effect) => {
      secondaryEffects.add(effect.effect);
    });
  });

  return Array.from(secondaryEffects);
}

function getStatMapFromCardMap(
  deckCards: Map<string, CardWithEffects>
): Map<string, Stat> {
  const statMap = new Map<string, Stat>();

  Array.from(deckCards.values()).forEach((card) => {
    card.statEffects.forEach((stat) => {
      if (statMap.has(stat.type.name)) {
        statMap.get(stat.type.name)!.amount += stat.amount;
      } else {
        statMap.set(stat.type.name, {
          name: stat.type.name,
          amount: stat.amount,
          percent: stat.percent,
        });
      }
    });
  });

  return statMap;
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

function tagMapFromArray(tagIds: string[]): Map<string, boolean> {
  const result = new Map<string, boolean>();

  tagIds.forEach((tagId) => {
    result.set(tagId, true);
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
  const [deckTags, setDeckTags] = useState<Map<string, boolean>>(
    deck
      ? tagMapFromArray(deck.tags.map((tag) => tag.id))
      : new Map<string, boolean>()
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
            cards: Array.from(deckCards.values()).map((card) => card.id),
            tags: Array.from(deckTags.keys()).filter((tagId) =>
              deckTags.get(tagId)
            ),
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
            cards: Array.from(deckCards.values()).map((card) => card.id),
            tags: Array.from(deckTags.keys()).filter((tagId) =>
              deckTags.get(tagId)
            ),
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
                deckTags.get(tag.id)
                  ? "bg-red-700 border border-transparent"
                  : "bg-transparent border border-red-700"
              } rounded-md mx-1 px-2 py-1 text-sm font-bold mb-3`}
              onClick={() =>
                setDeckTags(
                  new Map(deckTags.set(tag.id, !deckTags.get(tag.id)))
                )
              }
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}

      {Array.from(deckCards.values()).length > 0 && (
        <CardList
          cards={Array.from(deckCards.values())}
          removeCard={removeCardFromDeck}
        />
      )}

      {Array.from(getStatMapFromCardMap(deckCards).values()).length > 0 && (
        <>
          <h2 className="text-center text-3xl">Stat Effects</h2>
          <ul className="">
            {Array.from(getStatMapFromCardMap(deckCards).values()).map(
              (stat) => {
                return (
                  <li key={stat.name} className="text-center text-neutral-200">
                    {stat.name}: {stat.amount}
                    {stat.percent ? "%" : ""}
                  </li>
                );
              }
            )}
          </ul>
        </>
      )}

      {getSecondaryEffectsFromCardMap(deckCards).length > 0 && (
        <>
          <h2 className="text-center text-3xl">Secondary Effects</h2>
          <ul className="w-11/12 mx-auto list-disc">
            {getSecondaryEffectsFromCardMap(deckCards).map((effect) => (
              <li key={effect}>{effect}</li>
            ))}
          </ul>
        </>
      )}

      <CardCollection deckCards={deckCards} addCardToDeck={addCardToDeck} />
    </>
  );
};

export default DeckBuilder;
