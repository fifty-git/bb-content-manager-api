import type { NewVariant } from "~/core/domain/variants/entity";
import { and, eq } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { product_variants } from "~/schema/products";

export class VariantsDS {
  static async getAll(product_id: number) {
    return db
      .select({
        variant_id: product_variants.variant_id,
        name: product_variants.name,
        units: product_variants.units,
        price: product_variants.price,
        upc: product_variants.upc,
      })
      .from(product_variants)
      .where(and(eq(product_variants.active, 1), eq(product_variants.product_id, product_id)))
      .prepare()
      .execute();
  }

  static async create(data: NewVariant) {
    return db.insert(product_variants).values(data).prepare().execute();
  }

  static async disableVariant(product_id: number, variant_id: number) {
    return db
      .update(product_variants)
      .set({ active: 0 })
      .where(and(eq(product_variants.product_id, product_id), eq(product_variants.variant_id, variant_id)))
      .prepare()
      .execute();
  }
}
