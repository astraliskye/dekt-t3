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
    creator: {
      select: {
        name: true,
      },
    },
  },
});

export type DeckWithCards = Prisma.DeckGetPayload<typeof deckWithCards>;

const deckWithTags = Prisma.validator<Prisma.DeckArgs>()({
  include: {
    tags: true,
    creator: {
      select: {
        name: true,
      },
    },
  },
});

export type DeckWithTags = Prisma.DeckGetPayload<typeof deckWithTags>;

export interface Stat {
  name: string;
  amount: number;
  percent: boolean;
}
