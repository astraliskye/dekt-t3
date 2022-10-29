import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import CardList from "../../../components/card-list";
import Voting from "../../../components/deck-voting";
import { trpc } from "../../../utils/trpc";

const ViewDeck: NextPage = () => {
  const deckId = useRouter().query.deckId as string;
  const {
    data: deck,
    isLoading,
    isError,
  } = trpc.useQuery(["deck.byId", deckId]);

  if (isLoading) return <>Loading...</>;
  if (isError) return <>Error during request.</>;
  if (!deck) return <>Could not find deck.</>;

  return (
    <>
      <Link href={`/decks/${deck.id}/edit`}>
        <a>Edit Deck</a>
      </Link>
      <Voting
        userVote={deck.votes.at(0)}
        deckId={deck.id}
        voteCount={deck.voteCount}
      />
      <h1 className="text-5xl text-center pt-16 pb-8">{deck.name}</h1>
      {deck.description && (
        <p className="text-center mb-3">{deck.description}</p>
      )}

      <p className="text-neutral-500 text-sm text-center">
        {`Created by ${
          deck.creator.name
        } at ${deck.createdAt.toLocaleString()}`}
      </p>

      {deck.tags && (
        <div className="flex items-center justify-center py-4 mb-8">
          {deck.tags.map((tag) => (
            <span
              key={tag.id}
              className="bg-red-700 text-white rounded-md px-2 py-1 text-sm mr-2 font-bold select-none"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {deck.cards && <CardList cards={deck.cards} />}
    </>
  );
};

export default ViewDeck;
