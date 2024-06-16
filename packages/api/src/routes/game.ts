import { z } from "zod";

import { authedProcedure, publicProcedure, router } from "../context";

const gameSchema = z.object({
  id: z.string(),
  owner: z.string(),
  date: z.date(),
  venue: z.string(),
  players: z.array(
    z.object({
      deck: z.string(), // or z.array(z.string())? for partners?
      isMe: z.string().optional(),
      isWinner: z.boolean(),
    }),
  ),
  mulligan: z.string().max(8),
  openingHand: z.array(z.string()).max(7),
  bestPerformingCard: z.string(),
  winCondition: z.string(),
  isTournament: z.string(),
});

type Game = z.infer<typeof gameSchema>;

const games: Game[] = [];

export const gameRouter = router({
  createGame: publicProcedure
    .input(gameSchema.omit({ id: true }))
    .mutation(({ input }) => {
      const id = Date.now().toString();
      const game: Game = { id, ...input };
      games.push(game);
      return game;
    }),

  getGames: authedProcedure.query(() => {
    return games;
  }),

  getGame: authedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return games.find((game) => game.id === input.id);
    }),
});
