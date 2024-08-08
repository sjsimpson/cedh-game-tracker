import { initTRPC, TRPCError } from "@trpc/server";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

export function createContext({ req, res }: CreateFastifyContextOptions) {
  return {
    req,
    res,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

const isAuthenticated = () =>
  t.middleware(async ({ ctx, next }) => {
    if (!ctx.req.session.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must log in to view this resource",
      });
    }

    return next({
      ctx,
    });
  });

export const router = t.router;
export const publicProcedure = t.procedure;
export const authedProcedure = t.procedure.use(isAuthenticated());
