import { Prisma } from "@prisma/client";

const cardWithEffects = Prisma.validator<Prisma.CardArgs>()({
  include: { statEffects: { include: { type: true } }, secondaryEffects: true },
});

export type CardWithEffects = Prisma.CardGetPayload<typeof cardWithEffects>;

const deckWithCards = Prisma.validator<Prisma.DeckArgs>()({
  include: {
    cards: {
      include: {
        statEffects: { include: { type: true } },
        secondaryEffects: true,
      },
    },
    tags: true,
    creator: {
      select: {
        name: true,
      },
    },
  },
});

export type DeckWithCards = Prisma.DeckGetPayload<typeof deckWithCards>;

export type Deck = Prisma.DeckGetPayload;

export interface Stat {
  name: string;
  amount: number;
  percent: boolean;
}
