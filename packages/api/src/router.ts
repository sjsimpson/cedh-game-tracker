import { initTRPC } from "@trpc/server";
import { z } from "zod";

import { Context } from "./context";

type User = {
  id: string;
  name: string;
  bio?: string;
};

const users: User[] = [];

export const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  getUserById: t.procedure.input(z.string()).query((opts) => {
    return users.find((user) => user.id === opts.input); // input type is string
  }),
  getUsers: t.procedure.query(() => {
    return users;
  }),
  createUser: t.procedure
    .input(
      z.object({
        name: z.string().min(3),
        bio: z.string().max(142).optional(),
      }),
    )
    .mutation(({ input }) => {
      const id = Date.now().toString();
      const user: User = { id, ...input };
      users.push(user);
      return user;
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
