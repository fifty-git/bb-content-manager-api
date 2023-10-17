import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { CreateTagAPISchema } from "~/core/domain/tags/validator/create-tag-validator";
import { ProductTagsDS } from "~/core/infrastructure/drizzle/product-tags";
import { TagsDS } from "~/core/infrastructure/drizzle/tags";

export async function getProductTags(c: Context<EnvAPI>) {
  const product_id = c.req.param("product_id");
  const tags = await ProductTagsDS.getAll(+product_id);
  return c.json({ status: "success", data: tags }, 200);
}

export async function createProductTag(c: Context<EnvAPI>) {
  const product_id = parseInt(c.req.param("product_id"), 10);
  c.var.log.info(`Creating tags for product ID ${product_id}`);
  const data = await c.req.json();
  const validator = CreateTagAPISchema.safeParse({ ...data, product_id });
  if (!validator.success)
    return c.json({ status: "error", msg: `${validator.error.errors[0].message} (${validator.error.errors[0].path.join(".")})` }, 400);

  // Tag creation
  const [{ insertId }] = await TagsDS.create(data);

  // Product Tag creation
  const option = {
    tag_id: insertId,
    product_id,
  };
  await ProductTagsDS.create(option);

  return c.json({ status: "success", msg: `Tags for product ID ${insertId} were created successfully!` }, 201);
}

export async function deleteProductTag(c: Context<EnvAPI>) {
  const product_id = c.req.param("product_id");
  const tag_id = c.req.param("tag_id");
  await ProductTagsDS.delete(+product_id, +tag_id);
  return c.json(null, 204);
}
