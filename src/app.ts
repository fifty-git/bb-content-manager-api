import type { EnvAPI } from "~/core/domain/types";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import { secureHeaders } from "hono/secure-headers";
// import { createBundleOptions } from "~/core/application/bundle-options-service";
// import {
//   createBundleVariant,
//   deleteBundleVariant,
//   disableBundleVariant,
//   getBundleVariants,
//   reorderBundleVariants,
// } from "~/core/application/bundle-variants-service";
// import { getBundle, getBundles } from "~/core/application/bundles-service";
import {createProductOptions, reorderProductOptions} from "~/core/application/product-options-service";
import {
  createProductVariant,
  deleteProductVariant,
  disableProductVariant,
  getProductVariants,
  reorderProductVariants,
} from "~/core/application/product-variants-service";
import { createProduct, deleteProduct, disableProduct, enableProduct, getProduct, getProducts } from "~/core/application/products-service";
import { JWT_SECRET } from "~/modules/env";
import { handleErrors, NotFoundError } from "~/modules/errors";
import {
    activateCarrier,
  activateService,
  createCarrier,
  createService,
  deactivateCarrier,
  deactivateService,
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
app.put("/api/v1/content-manager/products/:product_id/activate", enableProduct);
app.put("/api/v1/content-manager/products/:product_id/deactivate", disableProduct);
app.delete("/api/v1/content-manager/products/:product_id", deleteProduct);
// app.get("/api/v1/content-manager/bundles", getBundles);
// app.get("/api/v1/content-manager/bundles/:bundle_id", getBundle);

app.get("/api/v1/content-manager/products/:product_id/variants", getProductVariants);
app.post("/api/v1/content-manager/products/:product_id/variants", createProductVariant);
app.put("/api/v1/content-manager/products/:product_id/variants/order", reorderProductVariants);
app.put("/api/v1/content-manager/products/:product_id/variants/:variant_id/deactivate", disableProductVariant);
app.delete("/api/v1/content-manager/products/:product_id/variants/:variant_id", deleteProductVariant);
app.post("/api/v1/content-manager/products/:product_id/variants/:variant_id/options", createProductOptions);
app.put("/api/v1/content-manager/products/:product_id/variants/:variant_id/options/order", reorderProductOptions);

// app.get("/api/v1/content-manager/bundles/:bundle_id/variants", getBundleVariants);
// app.post("/api/v1/content-manager/bundles/:bundle_id/variants", createBundleVariant);
// app.put("/api/v1/content-manager/bundles/:bundle_id/variants/order", reorderBundleVariants);
// app.put("/api/v1/content-manager/bundles/:bundle_id/variants/:variant_id/deactivate", disableBundleVariant);
// app.delete("/api/v1/content-manager/bundles/:bundle_id/variants/:variant_id", deleteBundleVariant);
// app.post("/api/v1/content-manager/bundles/:bundle_id/variants/:variant_id/options", createBundleOptions);

app.get("/api/v1/content-manager/carriers", getAllCarriers);
app.get("/api/v1/content-manager/carriers/:carrier_id", getCarrierById);
app.get("/api/v1/content-manager/carriers/:carrier_id/services", getAllCarrierServices);
app.get("/api/v1/content-manager/carriers/:carrier_id/services/:service_id", getCarrierServiceById);
app.post("/api/v1/content-manager/carriers", createCarrier);
app.post("/api/v1/content-manager/carriers/:carrier_id/services", createService);
app.put("/api/v1/content-manager/carriers/:carrier_id", updateCarrier);
app.put("/api/v1/content-manager/carriers/:carrier_id/services/:service_id", updateService);
app.put("/api/v1/content-manager/carriers/:carrier_id/activate", activateCarrier);
app.put("/api/v1/content-manager/carriers/:carrier_id/deactivate", deactivateCarrier);
app.delete("/api/v1/content-manager/carriers/:carrier_id", deleteCarrier);
app.put("/api/v1/content-manager/carriers/:carrier_id/services/:service_id/activate", activateService);
app.put("/api/v1/content-manager/carriers/:carrier_id/services/:service_id/deactivate", deactivateService);
app.delete("/api/v1/content-manager/carriers/:carrier_id/services/:service_id", deleteService);

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
