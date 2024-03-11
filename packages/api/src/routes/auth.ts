import { prisma } from "@cedh-game-tracker/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure, router } from "../context";

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

      ctx.req.session.user_id = user.id;
      ctx.req.session.save();

      return user.id;
    }),
  logout: publicProcedure.query(() => {
    return "";
  }),
});
