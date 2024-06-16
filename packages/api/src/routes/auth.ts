import { prisma } from "@cedh-game-tracker/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { authedProcedure, publicProcedure, router } from "../context";

export const authRouter = router({
  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input: { email, password } }) => {
      const user = await prisma.user.findUnique({
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
        },
        where: {
          email,
        },
      });

      if (!user || user.password !== password) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No matching user or incorrect password.",
        });
      }

      ctx.req.session.user = user.id;
      ctx.req.session.save();

      return user.id;
    }),
  validate: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.authenticated) throw new TRPCError({ code: "UNAUTHORIZED" });
    const user = await prisma.user.findUnique({
      where: { id: ctx.req.session.user },
      select: { id: true, username: true },
    });

    if (!user) throw new TRPCError({ code: "NOT_FOUND" });
    return { id: user.id }; // TODO: Maybe remove return value (not necessary)
  }),
  logout: authedProcedure.mutation(async ({ ctx }) => {
    if (ctx.req.session.user) {
      await ctx.req.session.destroy();
    }
    return "Logged out successfully.";
  }),
});
