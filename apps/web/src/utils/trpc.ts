import type { AppRouter } from "@cedh-game-tracker/api/router";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
