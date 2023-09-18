import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";

export async function getProducts(c: Context<EnvAPI>) {
  return c.json({ msg: "OK" });
}
