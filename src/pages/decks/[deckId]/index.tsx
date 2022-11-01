import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import CardList from "../../../components/card-list";
import DeckSummary from "../../../components/deck-summary";
import { trpc } from "../../../utils/trpc";

const ViewDeck: NextPage = () => {
  const deckId = useRouter().query.deckId as string;
  const { data: session } = useSession();
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
      {session?.user?.id === deck.creatorId && (
        <Link href={`/decks/${deck.id}/edit`}>
          <a>Edit Deck</a>
        </Link>
      )}

      <DeckSummary deck={deck} />

      {deck.cards && <CardList cards={deck.cards} />}
    </>
  );
};

export default ViewDeck;
