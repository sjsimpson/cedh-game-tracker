import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config({ path: ["../../../.env"] });

const useRedisClient = (function () {
  const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
  const REDIS_HOST = process.env.REDIS_HOST;
  const REDIS_PORT = process.env.REDIS_PORT;

  if (!REDIS_PASSWORD) {
    throw Error(
      "REDIS_PASSWORD is required. Update you environment variables.",
    );
  }
  if (!REDIS_HOST) {
    throw Error("REDIS_HOST is required. Update you environment variables.");
  }
  if (!REDIS_PORT) {
    throw Error("REDIS_PORT is required. Update you environment variables.");
  }

  const client = createClient({
    password: REDIS_PASSWORD,
    socket: {
      host: REDIS_HOST,
      port: parseInt(REDIS_PORT),
    },
  });
  client.on("error", (err) => console.log("Redis Client Error", err));

  return () => client;
})();

export { useRedisClient };
