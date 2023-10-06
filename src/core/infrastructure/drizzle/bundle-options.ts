import type { NewBundleVariantOption, NewBundleVariantOV } from "~/core/domain/bundle-options/entity";
import { and, desc, eq } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { bundle_variant_option_values, bundle_variant_options } from "~/schema/bundle-variants";

export class BundleOptionsDS {
  static async create(data: NewBundleVariantOption) {
    return db.insert(bundle_variant_options).values(data).prepare().execute();
  }

  static async createOptionValues(data: NewBundleVariantOV[]) {
    return db.insert(bundle_variant_option_values).values(data).prepare().execute();
  }

  static async getLastDisplayOrder(bundle_variant_id: number) {
    const results = await db
      .select({ display_order: bundle_variant_options.display_order })
      .from(bundle_variant_options)
      .where(and(eq(bundle_variant_options.bundle_variant_id, bundle_variant_id), eq(bundle_variant_options.status, "active")))
      .orderBy(desc(bundle_variant_options.display_order))
      .limit(1)
      .prepare()
      .execute();
    if (!results || results.length === 0) return 0;
    return results[0].display_order;
  }
}
