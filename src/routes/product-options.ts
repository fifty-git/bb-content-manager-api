import { Hono } from "hono";
import {
  createProductOptionsByVariant,
  deleteProductOption,
  disableProductOption,
  enableProductOption,
  reorderProductOptions,
} from "~/core/application/product-options-service";

export const optionsRouter = new Hono();

optionsRouter.post("/", createProductOptionsByVariant);
optionsRouter.put("/order", reorderProductOptions);
optionsRouter.put("/:variant_option_id/activate", enableProductOption);
optionsRouter.put("/:variant_option_id/deactivate", disableProductOption);
optionsRouter.delete("/:variant_option_id", deleteProductOption);
