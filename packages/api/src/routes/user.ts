import { prisma } from "@cedh-game-tracker/db";
import { z } from "zod";

import { publicProcedure, router } from "../context";

type User = {
  id: string;
  name: string;
  bio?: string;
};

const users: User[] = [];

export const userRouter = router({
  getUserById: publicProcedure.input(z.string()).query((opts) => {
    return users.find((user) => user.id === opts.input); // input type is string
  }),
  getUsers: publicProcedure.query(() => {
    return users;
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
