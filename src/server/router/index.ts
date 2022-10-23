// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { deckRouter } from "./deck";
import { cardRouter } from "./card";
import { tagRouter } from "./tag";
// import { protectedExampleRouter } from "./protected-example-router";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("deck.", deckRouter)
  .merge("card.", cardRouter)
  .merge("tag.", tagRouter);
// .merge("auth.", protectedExampleRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
