import { router } from "./context";
import { authRouter } from "./routes/auth";
import { gameRouter } from "./routes/game";

export const appRouter = router({
  auth: authRouter,
  games: gameRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
