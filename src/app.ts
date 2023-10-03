import type { EnvAPI } from "~/core/domain/types";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import { secureHeaders } from "hono/secure-headers";
import { createOptions } from "~/core/application/options-service";
import { createProduct, getProduct, getProducts } from "~/core/application/products-service";
import { createVariant, deleteVariant, getVariants } from "~/core/application/variants-service";
import { JWT_SECRET } from "~/modules/env";
import { handleErrors, NotFoundError } from "~/modules/errors";
import {
  createCarrier,
  createService,
  deleteCarrier,
  deleteService,
  getAllCarriers,
  getAllCarrierServices,
  getCarrierById,
  getCarrierServiceById,
  updateCarrier,
  updateService,
} from "./core/application/carriers-service";
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
app.get("/api/v1/content-manager/products/:product_id", getProduct);
app.post("/api/v1/content-manager/products", createProduct);

app.get("/api/v1/content-manager/products/:product_id/variants", getVariants);
app.post("/api/v1/content-manager/products/:product_id/variants", createVariant);
app.delete("/api/v1/content-manager/products/:product_id/variants/:variant_id", deleteVariant);
app.post("/api/v1/content-manager/products/:product_id/variants/:variant_id/options", createOptions);

app.get("/api/v1/content-manager/carriers", getAllCarriers);
app.get("/api/v1/content-manager/carriers/:carrier_id", getCarrierById);
app.get("/api/v1/content-manager/carriers/:carrier_id/services", getAllCarrierServices);
app.get("/api/v1/content-manager/carriers/:carrier_id/services/:service_id", getCarrierServiceById);
app.post("/api/v1/content-manager/carriers", createCarrier);
app.post("/api/v1/content-manager/carriers/:carrier_id/services", createService);
app.put("/api/v1/content-manager/carriers/:carrier_id", updateCarrier);
app.put("/api/v1/content-manager/carriers/:carrier_id/services/:service_id", updateService);
app.delete("/api/v1/content-manager/carriers/:carrier_id", deleteCarrier);
app.delete("/api/v1/content-manager/carriers/:carrier_id/services/:service_id", deleteService);

// 404 Not found
app.all("*", () => {
  throw new NotFoundError();
});
app.onError(handleErrors);
logger.info(`Running at http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
  app,
};
