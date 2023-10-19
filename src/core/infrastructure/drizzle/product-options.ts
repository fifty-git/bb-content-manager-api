import type { NewVariantOption, NewVariantOV } from "~/core/domain/product-options/entity";
import type { Transaction } from "~/core/domain/types";
import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { variant_option_values, variant_options } from "~/schema/product-variants";

export class ProductOptionsDS {
  static async getByVariantID(variant_id: number, tx?: Transaction) {
    return (tx ?? db).select().from(variant_options).where(eq(variant_options.variant_id, variant_id)).prepare().execute();
  }

  static async getOptionValues(variant_option_id: number, tx?: Transaction) {
    return (tx ?? db)
      .select()
      .from(variant_option_values)
      .where(eq(variant_option_values.variant_option_id, variant_option_id))
      .prepare()
      .execute();
  }

  static async reorder(display_order: number, variant_option_id: number, variant_id: number) {
    return db
      .update(variant_options)
      .set({ display_order })
      .where(
        and(
          eq(variant_options.variant_option_id, variant_option_id),
          eq(variant_options.variant_id, variant_id),
          eq(variant_options.status, "active"),
        ),
      )
      .prepare()
      .execute();
  }

  static async create(data: NewVariantOption, tx?: Transaction) {
    return (tx ?? db).insert(variant_options).values(data).prepare().execute();
  }

  static async createOptionValue(data: NewVariantOV, tx?: Transaction) {
    return (tx ?? db).insert(variant_option_values).values(data).prepare().execute();
  }

  static async createOptionValues(data: NewVariantOV[], tx?: Transaction) {
    return (tx ?? db).insert(variant_option_values).values(data).prepare().execute();
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

  static async enable(variant_id: number, variant_option_id: number) {
    return db
      .update(variant_options)
      .set({ status: "active" })
      .where(
        and(
          eq(variant_options.variant_id, variant_id),
          eq(variant_options.variant_option_id, variant_option_id),
          eq(variant_options.status, "inactive"),
        ),
      )
      .prepare()
      .execute();
  }

  static async disable(variant_id: number, variant_option_id: number) {
    return db
      .update(variant_options)
      .set({ status: "inactive" })
      .where(
        and(
          eq(variant_options.variant_id, variant_id),
          eq(variant_options.variant_option_id, variant_option_id),
          eq(variant_options.status, "active"),
        ),
      )
      .prepare()
      .execute();
  }

  static async delete(variant_id: number, variant_option_id: number) {
    return db
      .delete(variant_options)
      .where(
        and(
          eq(variant_options.variant_id, variant_id),
          eq(variant_options.variant_option_id, variant_option_id),
          eq(variant_options.status, "inactive"),
        ),
      )
      .prepare()
      .execute();
  }

  static async deleteManyByVariantID(variant_ids: number[], tx?: Transaction) {
    if (variant_ids.length === 0) return;
    return (tx ?? db).delete(variant_options).where(inArray(variant_options.variant_id, variant_ids));
  }
}
