import type { BundleVariant } from "~/core/domain/bundle-variants/entity";
import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { CreateBundleVariantAPISchema } from "~/core/domain/bundle-variants/validator/create-variant-validator";
import { ReorderBundleVariantsAPISchema } from "~/core/domain/bundle-variants/validator/reorder-variants-validator";
import { BundleVariantsDS } from "~/core/infrastructure/drizzle/bundle-variants";

async function getVariantOptions(variants: BundleVariant[]) {
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

async function getVariantOptionValues(variant: BundleVariant) {
  const variant_options = await BundleVariantsDS.getOptions(variant.bundle_variant_id);
  return await Promise.all(
    variant_options.map(async (option) => {
      const options = await BundleVariantsDS.getOptionValues(option.variant_option_id);
      return { ...option, options };
    }),
  );
}

export async function getBundleVariants(c: Context<EnvAPI>) {
  const bundle_id = c.req.param("bundle_id");
  const variants = await BundleVariantsDS.getAll(+bundle_id);
  const with_options = await getVariantOptions(variants);
  return c.json({ status: "success", data: with_options }, 200);
}

export async function createBundleVariant(c: Context<EnvAPI>) {
  const bundle_id = parseInt(c.req.param("bundle_id"), 10);
  const data = await c.req.json();
  const validator = CreateBundleVariantAPISchema.safeParse({ ...data, bundle_id });
  if (!validator.success)
    return c.json({ status: "error", msg: `${validator.error.errors[0].message} (${validator.error.errors[0].path.join(".")})` }, 400);

  // Variant creation
  const last_display_order = await BundleVariantsDS.getLastDisplayOrder(bundle_id);
  await BundleVariantsDS.create({ ...validator.data, display_order: last_display_order + 1 });
  return c.json({ status: "success", msg: "Variant creation was completed successfully!" }, 201);
}

export async function reorderBundleVariants(c: Context<EnvAPI>) {
  const bundle_id = parseInt(c.req.param("bundle_id"), 10);
  const data = await c.req.json();
  const validator = ReorderBundleVariantsAPISchema.safeParse({ ...data, bundle_id });
  if (!validator.success)
    return c.json({ status: "error", msg: `${validator.error.errors[0].message} (${validator.error.errors[0].path.join(".")})` }, 400);

  // Variant reordering
  await Promise.all(
    validator.data.variants.map((variant_id, index) => BundleVariantsDS.reorder(index, variant_id, validator.data.bundle_id)),
  );
  return c.json({ status: "success", msg: "Variants were reordered successfully" });
}

export async function disableBundleVariant(c: Context<EnvAPI>) {
  const bundle_id = c.req.param("bundle_id");
  const variant_id = c.req.param("variant_id");
  await BundleVariantsDS.disableVariant(+bundle_id, +variant_id);
  return c.json(null, 204);
}

export async function deleteBundleVariant(c: Context<EnvAPI>) {
  const bundle_id = c.req.param("bundle_id");
  const variant_id = c.req.param("variant_id");
  await BundleVariantsDS.delete(+bundle_id, +variant_id);
  return c.json(null, 204);
}
