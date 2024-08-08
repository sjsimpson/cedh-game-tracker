import { AppRouter } from "@cedh-game-tracker/api/router";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
