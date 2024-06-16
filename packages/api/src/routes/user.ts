import { prisma } from "@cedh-game-tracker/db";
import { z } from "zod";

import { publicProcedure, router } from "../context";

export const userRouter = router({
  // getUserById: publicProcedure.input(z.string()).query((opts) => {
  //   return users.find((user) => user.id === opts.input); // input type is string
  // }),
  getUsers: publicProcedure.query(() => {
    return prisma.user.findMany({ select: { id: true, username: true } });
  }),
  createUser: publicProcedure
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
});
