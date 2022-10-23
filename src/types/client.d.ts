import { Prisma } from "@prisma/client";

const cardWithEffects = Prisma.validator<Prisma.CardArgs>()({
  include: { statEffects: { include: { type: true } }, secondaryEffects: true },
});

export type CardWithEffects = Prisma.CardGetPayload<typeof cardWithEffects>;
