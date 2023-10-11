import { Hono } from "hono";
import {
  createProductVariant,
  deleteProductVariant,
  disableProductVariant,
  enableProductVariant,
  getProductVariants,
  reorderProductVariants,
} from "~/core/application/product-variants-service";

export const variantsRouter = new Hono();

variantsRouter.get("/", getProductVariants);
variantsRouter.post("/", createProductVariant);
variantsRouter.put("/order", reorderProductVariants);
variantsRouter.put("/:variant_id/activate", enableProductVariant);
variantsRouter.put("/:variant_id/deactivate", disableProductVariant);
variantsRouter.delete("/:variant_id", deleteProductVariant);
