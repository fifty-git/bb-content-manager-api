import { Hono } from "hono";
import {
  changeGroup,
  cloneProduct,
  createProduct,
  createProductOptions,
  deleteProduct,
  disableProduct,
  enableProduct,
  getProduct,
  getProducts,
  changeGroups
} from "~/core/application/products-service";

export const productsRouter = new Hono();

productsRouter.get("/", getProducts);
productsRouter.get("/:product_id", getProduct);
productsRouter.post("/", createProduct);
productsRouter.post("/:product_id/options", createProductOptions);
productsRouter.post("/:product_id/clone", cloneProduct);
productsRouter.put("/:product_id/activate", enableProduct);
productsRouter.put("/:product_id/deactivate", disableProduct);
productsRouter.put("/:product_id/subgroup/:subgroup_id/change", changeGroup);
productsRouter.put("/:product_id/subgroup/:subgroup_id/change", changeGroups);
productsRouter.delete("/:product_id", deleteProduct);
