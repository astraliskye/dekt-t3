import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Deck } from "../types/client";
import { trpc } from "../utils/trpc";

interface DeckVotingProps {
  deck: Deck;
}

const DeckVoting = ({ deck }: DeckVotingProps) => {
  const { data: session } = useSession();
  const { data: vote } = trpc.useQuery(["deck.userVote", { deckId: deck.id }]);

  const [upvote, setUpvote] = useState((vote && vote.direction > 0) || false);
  const [downvote, setDownvote] = useState(
    (vote && vote.direction < 0) || false
  );
  const [voteCount, setVoteCount] = useState(deck.voteCount);

  useEffect(() => {
    setUpvote((vote && vote.direction > 0) || false);
    setDownvote((vote && vote.direction < 0) || false);
  }, [vote]);

  const upvoteMutation = trpc.useMutation(["deck.upvote"]);
  const downvoteMutation = trpc.useMutation(["deck.downvote"]);
  const unvoteMutation = trpc.useMutation(["deck.unvote"]);

  return (
    <div className="flex flex-col flex-shrink w-32 items-center">
      <button
        onClick={async (e) => {
          e.stopPropagation();

          if (session && session.user) {
            if (upvote) {
              await unvoteMutation.mutateAsync({
                deckId: deck.id,
              });
              setUpvote(false);
              setVoteCount(voteCount - 1);
            } else {
              const voteDirection = await upvoteMutation.mutateAsync({
                deckId: deck.id,
              });

              if (voteDirection > 0) {
                setDownvote(false);
                setUpvote(true);
                setVoteCount(voteCount + voteDirection);
              } else {
                await unvoteMutation.mutateAsync({
                  deckId: deck.id,
                });
                setUpvote(false);
                setVoteCount(voteCount - 1);
              }
            }
          } else {
            signIn("discord");
          }
        }}
        className={`cursor-pointer ${
          upvote
            ? "bg-red-700 border border-transparent"
            : "bg-transparent border border-red-700"
        } rounded-md mx-1 px-2 py-1 text-sm font-bold mb-3`}
      >
        &#8593;
      </button>
      <span className="pb-4">{voteCount}</span>
      <button
        onClick={async (e) => {
          e.stopPropagation();

          if (session && session.user) {
            if (downvote) {
              await unvoteMutation.mutateAsync({
                deckId: deck.id,
              });
              setDownvote(false);
              setVoteCount(voteCount + 1);
            } else {
              const voteDirection = await downvoteMutation.mutateAsync({
                deckId: deck.id,
              });

              if (voteDirection < 0) {
                setUpvote(false);
                setDownvote(true);
                setVoteCount(voteCount + voteDirection);
              } else {
                await unvoteMutation.mutateAsync({
                  deckId: deck.id,
                });
                setDownvote(false);
                setVoteCount(voteCount + 1);
              }
            }
          } else {
            signIn("discord");
          }
        }}
        className={`cursor-pointer ${
          downvote
            ? "bg-red-700 border border-transparent"
            : "bg-transparent border border-red-700"
        } rounded-md mx-1 px-2 py-1 text-sm font-bold mb-3`}
      >
        &#8595;
      </button>
    </div>
  );
};

export default DeckVoting;
