import { createFileRoute, redirect } from "@tanstack/react-router";

import { api } from "../trpc/client";
import { trpc } from "../trpc/react";

const UNAUTHORIZED = 401;

// TODO: Extract this into "creatAuthedRoute", or an "authBeforeLoad" function
export const Route = createFileRoute("/my-games")({
  beforeLoad: async ({ context: { auth }, location }) => {
    if (!auth.user) {
      await api.auth.logout.mutate();
      throw redirect({
        code: UNAUTHORIZED,
        to: "/",
        search: {
          login: true,
          redirect: location.href,
        },
      });
    }

    try {
      await api.auth.validate.mutate();
    } catch (error) {
      throw redirect({
        code: UNAUTHORIZED,
        to: "/",
        search: {
          login: true,
          redirect: location.href,
        },
      });
    }
  },
  component: Notes,
});

function Notes() {
  const { data: games, isSuccess } = trpc.games.getGames.useQuery();

  return (
    <div className="p-2">
      <div>
        <h2>Games</h2>
        <div>{isSuccess && games.map((game) => <div>{game.id}</div>)}</div>
      </div>
      <h3>Things we need to track a game:</h3>
      <ul>
        <li>date</li>
        <li>venue</li>
        <li>players</li>
        <ul>
          <li>deck</li>
          <li>me</li>
          <li>winner</li>
          <li>no winner chosen... draw (prompt on save)</li>
        </ul>
        <li>opening hand & mulligan</li>
        <ul>
          <li>Best cards?</li>
          <li># cards kept</li>
          <li>full opening hand</li>
        </ul>
        <li>win condition</li>
        <ul>
          <li>combo pieces</li>
          <li>key cards</li>
          <li>win condition?</li>
        </ul>
        <li>is tournament</li>
      </ul>
      <div>authentication flows and data</div>
    </div>
  );
}
