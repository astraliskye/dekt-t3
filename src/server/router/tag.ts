import { createRouter } from "./context";

export const tagRouter = createRouter().query("all", {
  async resolve({ ctx }) {
    return await ctx.prisma.tag.findMany();
  },
});
