import Image from "next/image";
import React from "react";
import { CardWithEffects } from "../types/client";
import { trpc } from "../utils/trpc";

interface CardCollectionProps {
  addCardToDeck: (card: CardWithEffects) => void;
  deckCards: Map<string, CardWithEffects>;
}

const CardCollection = ({ addCardToDeck, deckCards }: CardCollectionProps) => {
  const { data: cards } = trpc.useQuery(["card.all"]);

  return (
    <>
      <h2 className="text-center text-3xl">Card Collection</h2>
      <div className="flex flex-wrap justify-center">
        {cards &&
          cards.map((card) => (
            <div
              key={card.id}
              className={`border ${
                deckCards.has(card.id) ? "border-red-700" : "border-white"
              } rounded-lg overflow-hidden m-1 cursor-pointer flex items-center justify-center`}
              onClick={() => {
                addCardToDeck(card);
              }}
            >
              <Image
                src={card.image}
                alt={card.name}
                draggable={false}
                objectFit="contain"
                width="175px"
                height="262px"
              />
            </div>
          ))}
      </div>
    </>
  );
};

export default CardCollection;
