import { Hono } from "hono";
import { createProductOptions, reorderProductOptions } from "~/core/application/product-options-service";

export const optionsRouter = new Hono();

optionsRouter.post("/", createProductOptions);
optionsRouter.put("/order", reorderProductOptions);
