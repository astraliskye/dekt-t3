import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Button from "../../components/button";
import TextInput from "../../components/text-input";
import { trpc } from "../../utils/trpc";
import { signIn } from "next-auth/react";
import { CardWithEffects } from "../../types/client";
import CardCollection from "../../components/card-collection";
import CardList from "../../components/card-list";

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

const Create: NextPage = () => {
  const router = useRouter();

  const { data: session } = useSession();
  const { data: tags } = trpc.useQuery(["tag.all"]);
  const createDeckMutation = trpc.useMutation(["deck.create"]);

  const [deckName, setDeckName] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [deckCards, setDeckCards] = useState<Map<string, CardWithEffects>>(
    new Map<string, CardWithEffects>()
  );
  const [deckTags, setDeckTags] = useState<Map<string, boolean>>(
    new Map<string, boolean>()
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (session && session.user) {
      try {
        createDeckMutation.mutate({
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
        <Button submit={true}>Create Deck</Button>
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

export default Create;
