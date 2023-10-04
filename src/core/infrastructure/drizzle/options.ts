import type { NewVariantOption, NewVariantOV } from "~/core/domain/options/entity";
import { and, desc, eq } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { variant_option_values, variant_options } from "~/schema/variants";

export class OptionsDS {
  static async create(data: NewVariantOption) {
    return db.insert(variant_options).values(data).prepare().execute();
  }

  static async createOptionValues(data: NewVariantOV[]) {
    return db.insert(variant_option_values).values(data).prepare().execute();
  }

  static async getLastDisplayOrder(variant_id: number) {
    const results = await db
      .select({ display_order: variant_options.display_order })
      .from(variant_options)
      .where(and(eq(variant_options.variant_id, variant_id), eq(variant_options.status, "active")))
      .orderBy(desc(variant_options.display_order))
      .limit(1)
      .prepare()
      .execute();
    if (!results || results.length === 0) return 0;
    return results[0].display_order;
  }
}
