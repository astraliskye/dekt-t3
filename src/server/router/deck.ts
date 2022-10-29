import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const deckRouter = createRouter()
  .query("all", {
    async resolve({ ctx }) {
      return await ctx.prisma.deck.findMany({
        include: {
          tags: true,
          votes: ctx.session?.user && {
            where: {
              voterId: ctx.session.user.id,
            },
          },
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
            include: {
              statEffects: { include: { type: true } },
              secondaryEffects: true,
            },
          },
          tags: true,
          votes: ctx.session?.user && {
            where: {
              voterId: ctx.session.user.id,
            },
          },
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
    }),
    async resolve({ ctx, input }) {
      if (ctx.session?.user) {
        return await ctx.prisma.deck.create({
          data: {
            name: input.name,
            description: input.description,
            creator: {
              connect: {
                id: ctx.session.user.id,
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
      }

      return null;
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      cards: z.string().array().optional(),
      tags: z.string().array().optional(),
    }),
    async resolve({ ctx, input }) {
      if (ctx.session?.user) {
        return ctx.prisma.deck.update({
          where: { id: input.id },
          data: {
            name: input.name,
            description: input.description,
            cards: input.cards && {
              set: [],
              connect: input.cards.map((cardId) => ({ id: cardId })),
            },
            tags: input.tags && {
              set: [],
              connect: input.tags?.map((tagId) => ({ id: tagId })),
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
            votes: {
              where: {
                voterId: ctx.session.user.id,
              },
            },
            creator: {
              select: {
                name: true,
              },
            },
          },
        });
      }

      return null;
    },
  })
  .mutation("upvote", {
    input: z.object({
      deckId: z.string(),
    }),
    async resolve({ ctx, input }) {
      if (ctx.session?.user === undefined) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No valid user session exists",
        });
      }

      const vote = await ctx.prisma.vote.findUnique({
        where: {
          deckId_voterId: {
            voterId: ctx.session.user.id,
            deckId: input.deckId,
          },
        },
      });

      if (vote === null) {
        // user has not voted
        await ctx.prisma.vote.create({
          data: {
            direction: 1,
            voterId: ctx.session.user.id,
            deckId: input.deckId,
          },
        });

        await ctx.prisma.deck.update({
          data: {
            voteCount: { increment: 1 },
          },
          where: {
            id: input.deckId,
          },
        });

        return 1;
      } else if (vote.direction > 0) {
        // user has upvoted already
        return 0;
      } else if (vote.direction < 0) {
        // user has downvoted previously
        await ctx.prisma.vote.update({
          data: {
            direction: 1,
          },
          where: {
            deckId_voterId: {
              voterId: ctx.session.user.id,
              deckId: input.deckId,
            },
          },
        });

        await ctx.prisma.deck.update({
          data: {
            voteCount: { increment: 2 },
          },
          where: {
            id: input.deckId,
          },
        });

        return 2;
      } else {
        // user has voted neutral previously
        await ctx.prisma.vote.update({
          data: {
            direction: 1,
          },
          where: {
            deckId_voterId: {
              voterId: ctx.session.user.id,
              deckId: input.deckId,
            },
          },
        });

        await ctx.prisma.deck.update({
          data: {
            voteCount: { increment: 1 },
          },
          where: {
            id: input.deckId,
          },
        });

        return 1;
      }
    },
  })
  .mutation("downvote", {
    input: z.object({
      deckId: z.string(),
    }),
    async resolve({ ctx, input }) {
      if (ctx.session?.user === undefined) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No valid user session exists",
        });
      }

      const vote = await ctx.prisma.vote.findUnique({
        where: {
          deckId_voterId: {
            voterId: ctx.session.user.id,
            deckId: input.deckId,
          },
        },
      });

      if (vote === null) {
        // user has not voted
        await ctx.prisma.vote.create({
          data: {
            direction: -1,
            voterId: ctx.session.user.id,
            deckId: input.deckId,
          },
        });

        await ctx.prisma.deck.update({
          data: {
            voteCount: { decrement: 1 },
          },
          where: {
            id: input.deckId,
          },
        });

        return -1;
      } else if (vote.direction < 0) {
        // user has downvoted already
        return 0;
      } else if (vote.direction > 0) {
        // user has upvoted previously
        await ctx.prisma.vote.update({
          data: {
            direction: -1,
          },
          where: {
            deckId_voterId: {
              voterId: ctx.session.user.id,
              deckId: input.deckId,
            },
          },
        });

        await ctx.prisma.deck.update({
          data: {
            voteCount: { decrement: 2 },
          },
          where: {
            id: input.deckId,
          },
        });

        return -2;
      } else {
        // user has voted neutral previously
        await ctx.prisma.vote.update({
          data: {
            direction: -1,
          },
          where: {
            deckId_voterId: {
              voterId: ctx.session.user.id,
              deckId: input.deckId,
            },
          },
        });

        await ctx.prisma.deck.update({
          data: {
            voteCount: { increment: -1 },
          },
          where: {
            id: input.deckId,
          },
        });

        return 1;
      }
    },
  })
  .mutation("unvote", {
    input: z.object({
      deckId: z.string(),
    }),
    async resolve({ ctx, input }) {
      if (ctx.session?.user === undefined) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No valid user session exists",
        });
      }

      const vote = await ctx.prisma.vote.delete({
        where: {
          deckId_voterId: {
            voterId: ctx.session.user.id,
            deckId: input.deckId,
          },
        },
      });

      if (vote.direction !== 0) {
        await ctx.prisma.deck.update({
          data: {
            voteCount: {
              increment: vote.direction > 0 ? -1 : 1,
            },
          },
          where: {
            id: input.deckId,
          },
        });
      }
    },
  });
