import { Vote } from "@prisma/client";
import { signIn, useSession } from "next-auth/react";
import React, { useState } from "react";
import { trpc } from "../utils/trpc";

interface DeckVotingProps {
  deckId: string;
  userVote?: Vote;
  voteCount: number;
}

const DeckVoting = ({ deckId, userVote, voteCount }: DeckVotingProps) => {
  const session = useSession();

  const [upvote, setUpvote] = useState(
    (userVote && userVote.direction > 0) || false
  );
  const [downvote, setDownvote] = useState(
    (userVote && userVote.direction < 0) || false
  );
  const [votes, setVotes] = useState(voteCount);

  const upvoteMutation = trpc.useMutation(["deck.upvote"]);
  const downvoteMutation = trpc.useMutation(["deck.downvote"]);
  const unvoteMutation = trpc.useMutation(["deck.unvote"]);

  return (
    <div className="flex flex-col flex-shrink w-32 items-center">
      <button
        onClick={async (e) => {
          e.stopPropagation();

          if (session.data && session.data.user) {
            if (upvote) {
              await unvoteMutation.mutateAsync({
                deckId: deckId,
              });
              setUpvote(false);
              setVotes(votes - 1);
            } else {
              const voteDirection = await upvoteMutation.mutateAsync({
                deckId: deckId,
              });

              if (voteDirection > 0) {
                setDownvote(false);
                setUpvote(true);
                setVotes(votes + voteDirection);
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
      <span className="pb-4">{votes}</span>
      <button
        onClick={async (e) => {
          e.stopPropagation();

          if (session.data && session.data.user) {
            if (downvote) {
              await unvoteMutation.mutateAsync({
                deckId,
              });
              setDownvote(false);
              setVotes(votes + 1);
            } else {
              const voteDirection = await downvoteMutation.mutateAsync({
                deckId,
              });

              if (voteDirection < 0) {
                setUpvote(false);
                setDownvote(true);
                setVotes(votes + voteDirection);
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
