import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifySession from "@fastify/session";
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import fastify from "fastify";

import redis from "./clients/redis";
import { createContext } from "./context";
import { appRouter, type AppRouter } from "./router";
import { EnvironmentError } from "./utils/errors";

const API_PORT = process.env.API_PORT;
const APP_ORIGIN = process.env.APP_ORIGIN;
const TRPC_PREFIX = process.env.TRPC_PREFIX;
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!API_PORT) throw EnvironmentError("API_PORT");
if (!APP_ORIGIN) throw EnvironmentError("APP_ORIGIN");
if (!TRPC_PREFIX) throw EnvironmentError("TRPC_PREFIX");
if (!SESSION_SECRET) throw EnvironmentError("SESSION_SECRET");

// Extend fastify.session with your custom type.
declare module "fastify" {
  interface Session {
    user: {
      id: string;
    };
  }
}

const server = fastify({
  maxParamLength: 5000,
});

// Register CORS for local dev
server.register(fastifyCors, {
  origin: APP_ORIGIN,
  methods: ["GET", "POST", "PATCH"],
  credentials: true,
});
server.register(fastifyCookie);
server.register(fastifySession, {
  store: redis.client,
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
      return {};
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
});

(async () => {
  try {
    await server.listen({ port: parseInt(API_PORT) });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
