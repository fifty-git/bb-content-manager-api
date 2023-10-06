import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { CreateBundleOptionsAPISchema } from "~/core/domain/bundle-options/validator/create-option-validator";
import { BundleOptionsDS } from "~/core/infrastructure/drizzle/bundle-options";

export async function createBundleOptions(c: Context<EnvAPI>) {
  const bundle_id = parseInt(c.req.param("bundle_id"), 10);
  const variant_id = parseInt(c.req.param("variant_id"), 10);
  const data = await c.req.json();
  const validator = CreateBundleOptionsAPISchema.safeParse({ ...data, bundle_id, variant_id });
  if (!validator.success)
    return c.json({ status: "error", msg: `${validator.error.errors[0].message} (${validator.error.errors[0].path.join(".")})` }, 400);

  // Option creation
  const last_display_order = await BundleOptionsDS.getLastDisplayOrder(variant_id);
  const option = {
    ...validator.data,
    display_order: last_display_order + 1,
  };
  const [{ insertId }] = await BundleOptionsDS.create(option);

  // Option values creation
  const option_values = validator.data.options.map((option_value, index) => {
    return { ...option_value, bvo_id: insertId, display_order: index };
  });
  await BundleOptionsDS.createOptionValues(option_values);

  return c.json({ status: "success", msg: `Options for bundle product ID ${bundle_id} were created successfully!` }, 201);
}
