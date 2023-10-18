import { Hono } from "hono";
import { createProductTag, deleteProductTag, getProductTags } from "~/core/application/product-tags-service";

export const tagsRouter = new Hono();

tagsRouter.get("/", getProductTags);
tagsRouter.post("/", createProductTag);
tagsRouter.delete("/:tag_id", deleteProductTag);
