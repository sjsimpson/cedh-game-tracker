import { initTRPC, TRPCError } from "@trpc/server";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

export function createContext({ req, res }: CreateFastifyContextOptions) {
  const authenticated = req.session.user ? true : false;
  return { req, res, authenticated };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

const isAuthenticated = () =>
  t.middleware(({ ctx, next }) => {
    if (!ctx.authenticated) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    // refresh token expiration
    ctx.req.session.touch();

    return next({
      ctx,
    });
  });

export const router = t.router;
export const publicProcedure = t.procedure;
export const authedProcedure = t.procedure.use(isAuthenticated());
