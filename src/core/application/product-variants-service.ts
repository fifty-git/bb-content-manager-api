import type { Variant } from "~/core/domain/product-variants/entity";
import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { CreateVariantAPISchema } from "~/core/domain/product-variants/validator/create-variant-validator";
import { ReorderVariantsAPISchema } from "~/core/domain/product-variants/validator/reorder-variants-validator";
import { ProductVariantsDS } from "~/core/infrastructure/drizzle/product-variants";

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
  const variant_options = await ProductVariantsDS.getOptions(variant.variant_id);
  return await Promise.all(
    variant_options.map(async (option) => {
      const options = await ProductVariantsDS.getOptionValues(option.variant_option_id);
      return { ...option, options };
    }),
  );
}

export async function getProductVariants(c: Context<EnvAPI>) {
  const product_id = c.req.param("product_id");
  const variants = await ProductVariantsDS.getAll(+product_id);
  const with_options = await getVariantOptions(variants);
  return c.json({ status: "success", data: with_options }, 200);
}

export async function createProductVariant(c: Context<EnvAPI>) {
  const product_id = parseInt(c.req.param("product_id"), 10);
  c.var.log.info(`Creating variant for product ID ${product_id}`);
  const data = await c.req.json();
  const validator = CreateVariantAPISchema.safeParse({ ...data, product_id });
  if (!validator.success)
    return c.json({ status: "error", msg: `${validator.error.errors[0].message} (${validator.error.errors[0].path.join(".")})` }, 400);

  // Variant creation
  const last_display_order = await ProductVariantsDS.getLastDisplayOrder(product_id);
  await ProductVariantsDS.create({ ...validator.data, display_order: last_display_order + 1 });
  return c.json({ status: "success", msg: "Variant creation was completed successfully!" }, 201);
}

export async function reorderProductVariants(c: Context<EnvAPI>) {
  const product_id = parseInt(c.req.param("product_id"), 10);
  c.var.log.info(`Reordering variants for product ID ${product_id}`);
  const data = await c.req.json();
  const validator = ReorderVariantsAPISchema.safeParse({ ...data, product_id });
  if (!validator.success)
    return c.json({ status: "error", msg: `${validator.error.errors[0].message} (${validator.error.errors[0].path.join(".")})` }, 400);

  // Variant reordering
  await Promise.all(
    validator.data.variants.map((variant_id, index) => ProductVariantsDS.reorder(index, variant_id, validator.data.product_id)),
  );
  return c.json({ status: "success", msg: "Variants were reordered successfully" });
}

export async function disableProductVariant(c: Context<EnvAPI>) {
  const product_id = c.req.param("product_id");
  const variant_id = c.req.param("variant_id");
  await ProductVariantsDS.disableVariant(+product_id, +variant_id);
  return c.json(null, 204);
}

export async function deleteProductVariant(c: Context<EnvAPI>) {
  const product_id = c.req.param("product_id");
  const variant_id = c.req.param("variant_id");
  await ProductVariantsDS.delete(+product_id, +variant_id);
  return c.json(null, 204);
}
