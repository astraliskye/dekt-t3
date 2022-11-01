import Link from "next/link";
import React from "react";
import { DeckWithTags } from "../types/client";
import DeckVoting from "./deck-voting";
import Tag from "./tag";

interface DeckSummaryProps {
  deck: DeckWithTags;
  link?: boolean;
}

const DeckSummary = ({ deck, link }: DeckSummaryProps) => {
  return (
    <div className="flex justify-between items-center max-w-4xl mx-auto bg-neutral-900 rounded-lg px-8 py-6">
      <div>
        {link ? (
          <Link href={`/decks/${deck.id}`}>
            <h2 className="text-xl cursor-pointer">{deck.name}</h2>
          </Link>
        ) : (
          <h2 className="text-xl">{deck.name}</h2>
        )}
        <p>{deck.description}</p>
        <p className="text-neutral-400 text-xs mb-3">
          Created by {deck.creator.name} on {deck.createdAt.toLocaleString()}
        </p>
        <div className="flex flex-wrap">
          {deck.tags.map((tag) => (
            <span key={tag.id} className="px-2 py-2">
              <Tag name={tag.name} />
            </span>
          ))}
        </div>
      </div>

      <DeckVoting deck={deck} />
    </div>
  );
};

export default DeckSummary;
