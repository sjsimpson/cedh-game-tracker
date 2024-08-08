import RedisStore from "connect-redis";
import { createClient } from "redis";

import { EnvironmentError } from "../utils/errors";

class Redis {
  public client: RedisStore;

  constructor() {
    const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
    const REDIS_HOST = process.env.REDIS_HOST;
    const REDIS_PORT = process.env.REDIS_PORT;

    if (!REDIS_PASSWORD) throw EnvironmentError("REDIS_PASSWORD");
    if (!REDIS_HOST) throw EnvironmentError("REDIS_HOST");
    if (!REDIS_PORT) throw EnvironmentError("REDIS_PORT");

    const client = createClient({
      password: REDIS_PASSWORD,
      socket: {
        host: REDIS_HOST,
        port: parseInt(REDIS_PORT),
      },
    });

    client
      .on("error", (err) => console.log("Redis Client Error", err))
      .connect();

    this.client = new RedisStore({
      client,
      prefix: "myapp:",
    });
  }
}

const redis = new Redis();
export default redis;
