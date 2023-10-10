import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { SalesChannelsDS } from "~/core/infrastructure/drizzle/sales-channels";

export async function getSalesChannels(c: Context<EnvAPI>) {
  const sc = await SalesChannelsDS.getAll();
  return c.json({ status: "success", data: sc });
}
