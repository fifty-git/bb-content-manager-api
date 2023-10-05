import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { CreateProductOptionsAPISchema } from "~/core/domain/product-options/validator/create-option-validator";
import { ProductOptionsDS } from "~/core/infrastructure/drizzle/product-options";

export async function createProductOptions(c: Context<EnvAPI>) {
  const product_id = parseInt(c.req.param("product_id"), 10);
  const variant_id = parseInt(c.req.param("variant_id"), 10);
  c.var.log.info(`Creating options for product ID ${product_id} - Variant ID: ${variant_id}`);
  const data = await c.req.json();
  const validator = CreateProductOptionsAPISchema.safeParse({ ...data, product_id, variant_id });
  if (!validator.success)
    return c.json({ status: "error", msg: `${validator.error.errors[0].message} (${validator.error.errors[0].path.join(".")})` }, 400);

  // Option creation
  const last_display_order = await ProductOptionsDS.getLastDisplayOrder(variant_id);
  const option = {
    ...validator.data,
    display_order: last_display_order + 1,
  };
  const [{ insertId }] = await ProductOptionsDS.create(option);

  // Option values creation
  const option_values = validator.data.options.map((option_value, index) => {
    return { ...option_value, variant_option_id: insertId, display_order: index };
  });
  await ProductOptionsDS.createOptionValues(option_values);

  return c.json({ status: "success", msg: `Options for product ID ${product_id} were created successfully!` }, 201);
}
