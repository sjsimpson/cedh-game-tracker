import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";

import { createContext } from "./context.ts";
import { appRouter } from "./router.ts";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  }),
);
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.listen(4000);
