import type { EnvAPI } from "~/core/domain/types";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import { secureHeaders } from "hono/secure-headers";
import { JWT_SECRET } from "~/modules/env";
import { handleErrors, NotFoundError } from "~/modules/errors";
import { carriersRouter } from "~/routes/carriers";
import { optionsRouter } from "~/routes/product-options";
import { variantsRouter } from "~/routes/product-variants";
import { productsRouter } from "~/routes/products";
import { bindLogger, logger, uuid } from "./modules/logger";
import { groupsRouter } from "./routes/groups";

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
app.route("/api/v1/content-manager/products", productsRouter);
app.route("/api/v1/content-manager/groups", groupsRouter);
app.route("/api/v1/content-manager/products/:product_id/variants", variantsRouter);
app.route("/api/v1/content-manager/products/:product_id/variants/:variant_id/options", optionsRouter);
app.route("/api/v1/content-manager/carriers", carriersRouter);

// 404 Not found
app.all("*", (c) => {
  logger.error(`Not found - METHOD: ${c.req.method} - PATH: (${c.req.path})`);
  throw new NotFoundError();
});
app.onError(handleErrors);
logger.info(`Running at http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
  app,
};
