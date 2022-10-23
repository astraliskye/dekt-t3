import React from "react";
import { CardWithEffects } from "../types/client";

interface CardListProps {
  cards: CardWithEffects[];
  removeCard: (cardId: string) => void;
}

const CardList = ({ cards, removeCard }: CardListProps) => {
  return (
    <>
      <h2 className="text-center text-3xl">Deck</h2>

      <div className="flex flex-col items-center">
        {cards?.map((card) => (
          <div
            key={card.id}
            className="w-72 bg-neutral-900 border border-red-700 px-3 py-2 rounded-md mb-1 cursor-pointer select-none"
            onClick={() => removeCard(card.id)}
          >
            {card.name}
          </div>
        ))}
      </div>
    </>
  );
};

export default CardList;
