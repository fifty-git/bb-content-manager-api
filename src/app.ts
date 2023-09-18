import type { EnvAPI } from "~/core/domain/types";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import { secureHeaders } from "hono/secure-headers";
import { getProducts } from "~/core/application/products-service";
import { JWT_SECRET } from "~/modules/env";
import { handleErrors } from "~/modules/errors";
import { bindLogger, logger, uuid } from "./modules/logger";
// import { profile_execution } from "~/modules/profiler";

const port = parseInt(process.env.PORT ?? "3000", 10);
const app: Hono<EnvAPI, any, "/"> = new Hono();
app.use("*", uuid);
app.use("*", bindLogger);
app.use(
  "/api/v1/*",
  cors({
    credentials: true,
    origin: (origin) => {
      if (origin.endsWith(".fiftyflowers.com") || origin === "https://fiftyflowers.com") return origin;
      return "http://localhost:3000";
    },
  }),
);
app.get("*", secureHeaders());
app.use("/*", jwt({ secret: JWT_SECRET, cookie: "token" }));

// Protected routes
app.get("/api/v1/content-manager/products", getProducts);

app.onError(handleErrors);
logger.info(`Running at http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
  app,
};
