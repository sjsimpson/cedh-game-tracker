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

      ctx.req.session.user = user.id;
      ctx.req.session.save();

      return user.id;
    }),
  logout: authedProcedure.mutation(async ({ ctx }) => {
    if (ctx.req.session.user) {
      await ctx.req.session.destroy();
    }
  }),
  validate: authedProcedure.mutation(() => {}),
});
