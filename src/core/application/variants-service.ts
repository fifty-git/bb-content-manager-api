import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { CreateVariantAPISchema } from "~/core/domain/variants/validator/create-variant-validator";
import { VariantsDS } from "~/core/infrastructure/drizzle/variants";

export async function getVariants(c: Context<EnvAPI>) {
  const product_id = c.req.param("product_id");
  const variants = await VariantsDS.getAll(+product_id);
  return c.json({ status: "success", data: variants }, 200);
}

export async function createVariant(c: Context<EnvAPI>) {
  // Validator
  const product_id = parseInt(c.req.param("product_id"), 10);
  const data = await c.req.json();
  const validator = CreateVariantAPISchema.safeParse({ ...data, product_id });
  if (!validator.success)
    return c.json({ status: "error", msg: `${validator.error.errors[0].message} (${validator.error.errors[0].path.join(".")})` }, 400);

  // Variant creation
  await VariantsDS.create(validator.data);
  return c.json({ status: "success", msg: "Variant creation was completed successfully!" }, 201);
}

export async function deleteVariant(c: Context<EnvAPI>) {
  const product_id = c.req.param("product_id");
  const variant_id = c.req.param("variant_id");
  await VariantsDS.disableVariant(+product_id, +variant_id);
  return c.json(null, 204);
}
