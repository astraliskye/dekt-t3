import { NextPage } from "next";
import React from "react";
import DeckSummary from "../../components/deck-summary";
import { trpc } from "../../utils/trpc";

const Decks: NextPage = () => {
  const decks = trpc.useQuery(["deck.all"]);

  return (
    <>
      <h1 className="text-5xl text-center pt-16 pb-8">Decks</h1>
      <div className="py-4">
        {decks.data && decks.data?.length > 0 ? (
          decks.data
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((deck) => <DeckSummary key={deck.id} link deck={deck} />)
        ) : (
          <p className="text-white text-center">
            There are no decks to display.
          </p>
        )}
      </div>
    </>
  );
};

export default Decks;
