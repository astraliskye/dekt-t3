import { useRouter } from "next/router";
import React from "react";
import DeckBuilder from "../../../components/deck-builder";
import { trpc } from "../../../utils/trpc";

const Edit = () => {
  const deckId = useRouter().query.deckId as string;

  const { data: deck } = trpc.useQuery(["deck.byId", deckId]);

  return deck ? <DeckBuilder deck={deck} /> : "No deck found";
};

export default Edit;
