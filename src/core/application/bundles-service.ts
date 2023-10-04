import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { BundlesDS } from "~/core/infrastructure/drizzle/bundles";
import { GroupsDS } from "~/core/infrastructure/drizzle/groups";

async function getBundlesWithGroups() {
  const bundles = await BundlesDS.getAll();
  return Promise.all(
    bundles.map(async (bundle) => {
      const group = await GroupsDS.getGroupByBundleID(bundle.bundle_id);
      const subgroup = await GroupsDS.getSubgroupByBundleID(bundle.bundle_id);
      return { ...bundle, product_type: "bundle", group, subgroup };
    }),
  );
}

export async function getBundles(c: Context<EnvAPI>) {
  const bundles = await getBundlesWithGroups();
  return c.json({ status: "success", data: bundles });
}
