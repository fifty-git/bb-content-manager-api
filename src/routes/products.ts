import { Hono } from "hono";
import {
  createProduct,
  createProductOptions,
  deleteProduct,
  disableProduct,
  enableProduct,
  getProduct,
  getProducts,
} from "~/core/application/products-service";

export const productsRouter = new Hono();

productsRouter.get("/", getProducts);
productsRouter.get("/:product_id", getProduct);
productsRouter.post("/", createProduct);
productsRouter.post("/:product_id/options", createProductOptions);
productsRouter.put("/:product_id/activate", enableProduct);
productsRouter.put("/:product_id/deactivate", disableProduct);
productsRouter.delete("/:product_id", deleteProduct);
