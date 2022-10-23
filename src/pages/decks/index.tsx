import { NextPage } from "next";
import Link from "next/link";
import React, { useEffect } from "react";
import { trpc } from "../../utils/trpc";

const Decks: NextPage = () => {
  const decks = trpc.useQuery(["deck.all"]);

  useEffect(() => {
    console.log("decks:", decks);
  }, [decks]);

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
            .map((deck) => (
              <Link href={`/decks/${deck.id}`} key={deck.id}>
                <div className="bg-neutral-900 rounded-lg p-8 my-4 cursor-pointer">
                  <h2 className="text-2xl mb-4">{deck.name}</h2>
                  <p>{deck.description || "No description"}</p>
                  <p className="text-neutral-400 text-xs">
                    Created by {deck.creator.name}
                  </p>
                  {deck.tags.length > 0 && (
                    <div className="pt-4">
                      {deck.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="bg-red-700 text-white rounded-md px-2 py-1 text-sm mr-2 font-bold"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))
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
