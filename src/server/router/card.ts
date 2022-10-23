import { createRouter } from "./context";

export const cardRouter = createRouter().query("all", {
  async resolve({ ctx }) {
    return await ctx.prisma.card.findMany({
      include: {
        statEffects: { include: { type: true } },
        secondaryEffects: true,
      },
    });
  },
});
