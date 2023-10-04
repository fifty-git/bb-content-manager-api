import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { CreateOptionsAPISchema } from "~/core/domain/options/validator/create-option-validator";
import { OptionsDS } from "~/core/infrastructure/drizzle/options";

export async function createOptions(c: Context<EnvAPI>) {
  // Validator
  const product_id = parseInt(c.req.param("product_id"), 10);
  const variant_id = parseInt(c.req.param("variant_id"), 10);
  const data = await c.req.json();
  const validator = CreateOptionsAPISchema.safeParse({ ...data, product_id, variant_id });
  if (!validator.success)
    return c.json({ status: "error", msg: `${validator.error.errors[0].message} (${validator.error.errors[0].path.join(".")})` }, 400);

  // Option creation
  const last_display_order = await OptionsDS.getLastDisplayOrder(variant_id);
  const option = {
    ...validator.data,
    display_order: last_display_order + 1,
  };
  const [{ insertId }] = await OptionsDS.create(option);

  // Option values creation
  const option_values = validator.data.options.map((option_value, index) => {
    return { ...option_value, variant_option_id: insertId, display_order: index };
  });
  await OptionsDS.createOptionValues(option_values);

  return c.json({ status: "success", msg: `Options for product ID ${product_id} were created successfully!` }, 201);
}
