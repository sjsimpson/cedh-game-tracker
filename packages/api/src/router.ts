import { router } from "./context";
import { gameRouter } from "./routes/game";
import { userRouter } from "./routes/user";

export const appRouter = router({
  games: gameRouter,
  users: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
