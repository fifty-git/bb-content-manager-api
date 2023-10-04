import type { EnvAPI } from "~/core/domain/types";
import type { Variant } from "~/core/domain/variants/entity";
import type { Context } from "hono";
import { CreateVariantAPISchema } from "~/core/domain/variants/validator/create-variant-validator";
import { ReorderVariantsAPISchema } from "~/core/domain/variants/validator/reorder-variants-validator";
import { VariantsDS } from "~/core/infrastructure/drizzle/variants";

async function getVariantOptions(variants: Variant[]) {
  return await Promise.all(
    variants.map(async (variant) => {
      const variant_options = await getVariantOptionValues(variant);
      return {
        ...variant,
        variant_options,
      };
    }),
  );
}

async function getVariantOptionValues(variant: Variant) {
  const variant_options = await VariantsDS.getOptions(variant.variant_id);
  return await Promise.all(
    variant_options.map(async (option) => {
      const options = await VariantsDS.getOptionValues(option.variant_option_id);
      return { ...option, options };
    }),
  );
}

export async function getVariants(c: Context<EnvAPI>) {
  const product_id = c.req.param("product_id");
  const variants = await VariantsDS.getAll(+product_id);
  const with_options = await getVariantOptions(variants);
  return c.json({ status: "success", data: with_options }, 200);
}

export async function createVariant(c: Context<EnvAPI>) {
  // Validator
  const product_id = parseInt(c.req.param("product_id"), 10);
  const data = await c.req.json();
  const validator = CreateVariantAPISchema.safeParse({ ...data, product_id });
  if (!validator.success)
    return c.json({ status: "error", msg: `${validator.error.errors[0].message} (${validator.error.errors[0].path.join(".")})` }, 400);

  // Variant creation
  const last_display_order = await VariantsDS.getLastDisplayOrder(product_id);
  await VariantsDS.create({ ...validator.data, display_order: last_display_order + 1 });
  return c.json({ status: "success", msg: "Variant creation was completed successfully!" }, 201);
}

export async function reorderVariants(c: Context<EnvAPI>) {
  // Validator
  const product_id = parseInt(c.req.param("product_id"), 10);
  const data = await c.req.json();
  const validator = ReorderVariantsAPISchema.safeParse({ ...data, product_id });
  if (!validator.success)
    return c.json({ status: "error", msg: `${validator.error.errors[0].message} (${validator.error.errors[0].path.join(".")})` }, 400);

  // Variant reordering
  await Promise.all(validator.data.variants.map((variant_id, index) => VariantsDS.reorder(index, variant_id, validator.data.product_id)));
  return c.json({ status: "success", msg: "Variants were reordered successfully" });
}

export async function disableVariant(c: Context<EnvAPI>) {
  const product_id = c.req.param("product_id");
  const variant_id = c.req.param("variant_id");
  await VariantsDS.disableVariant(+product_id, +variant_id);
  return c.json(null, 204);
}

export async function deleteVariant(c: Context<EnvAPI>) {
  const product_id = c.req.param("product_id");
  const variant_id = c.req.param("variant_id");
  await VariantsDS.delete(+product_id, +variant_id);
  return c.json(null, 204);
}
