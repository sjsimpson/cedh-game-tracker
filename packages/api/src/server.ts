import { redisStore } from "@cedh-game-tracker/cache";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifySession from "@fastify/session";
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import fastify from "fastify";

import { createContext } from "./context";
import { appRouter, type AppRouter } from "./router";

const API_PORT = process.env.API_PORT ? parseInt(process.env.API_PORT) : 5000;
const APP_ORIGIN = process.env.APP_ORIGIN || "http://localhost:5173";
const TRPC_PREFIX = process.env.TRPC_PREFIX || "/trpc";
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) throw Error("SESSION_SECRET is required");

// Extend fastify.session with your custom type.
declare module "fastify" {
  interface Session {
    user: string;
  }
}

const server = fastify({
  maxParamLength: 5000,
});
server.register;
server.register(fastifyCors, {
  origin: APP_ORIGIN,
  methods: ["GET", "POST", "PATCH"],
  credentials: true,
});
server.register(fastifyCookie);
server.register(fastifySession, {
  store: redisStore,
  secret: SESSION_SECRET,
  saveUninitialized: false,
  cookie: {
    path: "/",
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
    sameSite: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
  },
});
server.register(fastifyTRPCPlugin, {
  prefix: TRPC_PREFIX,
  trpcOptions: {
    router: appRouter,
    createContext,
    onError({ path, error }) {
      // report to error monitoring
      console.error(`Error in tRPC handler on path '${path}':`, error);
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
});
(async () => {
  try {
    await server.listen({ port: API_PORT });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
