import { router } from "./context";
import { authRouter } from "./routes/auth";
import { gameRouter } from "./routes/game";
import { userRouter } from "./routes/user";

export const appRouter = router({
  auth: authRouter,
  games: gameRouter,
  users: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
