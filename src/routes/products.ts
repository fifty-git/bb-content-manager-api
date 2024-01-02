import { Hono } from "hono";
import {
  changeGroup,
  changeGroups,
  cloneProduct,
  createOffer,
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
productsRouter.post("/:product_id/clone", cloneProduct);
productsRouter.post("/:product_id/offers", createOffer);
productsRouter.put("/:product_id/activate", enableProduct);
productsRouter.put("/:product_id/deactivate", disableProduct);
productsRouter.put("/:product_id/subgroup/:subgroup_id/change", changeGroup);
productsRouter.put("/subgroups/change", changeGroups);
productsRouter.delete("/:product_id", deleteProduct);
