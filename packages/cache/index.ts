import RedisStore from "connect-redis";

import { useRedisClient } from "./redis";

const redisClient = useRedisClient();
redisClient.connect();

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "cedh-game-tracker:",
});

export { redisStore };
