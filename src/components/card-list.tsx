import React from "react";
import { CardWithEffects, Stat } from "../types/client";

interface CardListProps {
  cards: CardWithEffects[];
  removeCard?: (cardId: string) => void;
}

function statsFromCards(cards: CardWithEffects[]): Stat[] {
  const statMap = new Map<string, Stat>();

  cards.forEach((card) => {
    card.statEffects.forEach((stat) => {
      if (statMap.has(stat.type.id)) {
        statMap.get(stat.type.id)!.amount += stat.amount;
      } else {
        statMap.set(stat.type.id, {
          name: stat.type.name,
          amount: stat.amount,
          percent: stat.percent,
        });
      }
    });
  });

  return [...statMap.values()];
}

function secondaryEffectsFromCards(cards: CardWithEffects[]): string[] {
  const effectSet = new Set<string>();

  cards.forEach((card) => {
    card.secondaryEffects.forEach((secondaryEffect) => {
      effectSet.add(secondaryEffect.effect);
    });
  });

  return [...effectSet.values()];
}

const CardList = ({ cards, removeCard }: CardListProps) => {
  const stats = statsFromCards(cards);
  const secondaryEffects = secondaryEffectsFromCards(cards);

  return (
    <div className="w-72 mx-auto">
      <h2 className="text-center text-3xl">Deck</h2>

      {cards && (
        <div className="flex flex-col items-center">
          {cards.map((card) => (
            <div
              key={card.id}
              className="w-full bg-neutral-900 border border-red-700 px-3 py-2 rounded-md mb-1 cursor-pointer select-none"
              onClick={removeCard && (() => removeCard(card.id))}
            >
              {card.name}
            </div>
          ))}
        </div>
      )}

      <h2 className="text-center text-3xl">Stat Effects</h2>

      {stats && (
        <ul>
          {stats.map((stat) => (
            <li key={stat.name}>
              {`${stat.amount}${stat.percent ? "%" : ""} ${stat.name}`}
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-center text-3xl">SecondaryEffects</h2>

      {secondaryEffects && (
        <ul>
          {secondaryEffects.map((effect) => (
            <li key={effect} className="py-2">
              {effect}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CardList;
