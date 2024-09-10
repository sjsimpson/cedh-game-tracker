import { prisma } from "@cedh-game-tracker/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { authedProcedure, publicProcedure, router } from "../context";

export const authRouter = router({
  signUp: publicProcedure
    .input(
      z.object({
        username: z.string().min(3),
        email: z.string().min(3),
        password: z.string().min(3).max(142),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.create({
        select: {
          id: true,
        },
        data: {
          username: input.username,
          email: input.email,
          password: input.password,
        },
      });
      return user;
    }),
  signIn: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input: { email, password } }) => {
      const user = await prisma.user.findUnique({
        select: {
          id: true,
          username: true,
          email: true,
        },
        where: {
          email,
          password,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No matching user or incorrect password.",
        });
      }

      ctx.req.session.user = { id: user.id };
      ctx.req.session.save();

      return user.id;
    }),
  signOut: authedProcedure.mutation(async ({ ctx }) => {
    if (ctx.req.session.user) {
      await ctx.req.session.destroy();
    }
  }),
  validateSession: authedProcedure.mutation(() => {}),
});
