import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { VariantsDS } from "~/core/infrastructure/drizzle/variants";

export async function getVariants(c: Context<EnvAPI>) {
  const product_id = c.req.param("product_id");
  const variants = await VariantsDS.getAll(+product_id);
  return c.json({ status: "success", data: variants }, 200);
}

export async function deleteVariant(c: Context<EnvAPI>) {
  const product_id = c.req.param("product_id");
  const variant_id = c.req.param("variant_id");
  await VariantsDS.disableVariant(+product_id, +variant_id);
  return c.json(null, 204);
}
