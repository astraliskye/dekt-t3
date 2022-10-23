import { createRouter } from "./context";
import { string, z } from "zod";

export const deckRouter = createRouter()
  .query("all", {
    async resolve({ ctx }) {
      return await ctx.prisma.deck.findMany({
        include: {
          tags: true,
          creator: {
            select: {
              name: true,
            },
          },
        },
      });
    },
  })
  .query("byId", {
    input: z.string(),
    async resolve({ ctx, input: deckId }) {
      return await ctx.prisma.deck.findUnique({
        where: { id: deckId },
        include: {
          cards: {
            include: { statEffects: { include: { type: true } } },
          },
          tags: true,
          creator: {
            select: {
              name: true,
            },
          },
        },
      });
    },
  })
  .mutation("create", {
    input: z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      cards: z.string().array().optional(),
      tags: z.string().array().optional(),
      creator: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.deck.create({
        data: {
          name: input.name,
          description: input.description,
          creator: {
            connect: {
              id: input.creator,
            },
          },
          cards: {
            connect: input.cards?.map((cardId) => ({
              id: cardId,
            })),
          },
          tags: {
            connect: input.tags?.map((tagId) => ({
              id: tagId,
            })),
          },
        },
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
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      cards: z.object({ cardId: string() }).array().optional(),
      tags: z.object({ tagId: z.string() }).array().optional(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.deck.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
        },
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
    },
  });
