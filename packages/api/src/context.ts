import { initTRPC } from "@trpc/server";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

export function createContext({ req, res }: CreateFastifyContextOptions) {
  const user = { name: req.headers.username ?? "anonymous" };
  return { req, res, user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
