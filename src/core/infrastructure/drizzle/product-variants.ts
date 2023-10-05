import type { NewVariant } from "~/core/domain/product-variants/entity";
import type { Transaction } from "~/core/domain/types";
import { and, desc, eq } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { variant_option_values, variant_options } from "~/schema/product-variants";
import { product_variants } from "~/schema/products";

export class ProductVariantsDS {
  static async getAll(product_id: number) {
    return db
      .select({
        variant_id: product_variants.variant_id,
        name: product_variants.name,
        units: product_variants.units,
        measure_units: product_variants.measure_units,
        price: product_variants.price,
        upc: product_variants.upc,
      })
      .from(product_variants)
      .where(and(eq(product_variants.status, "active"), eq(product_variants.product_id, product_id)))
      .orderBy(product_variants.display_order)
      .prepare()
      .execute();
  }

  static async getByProductID(product_id: number, tx?: Transaction) {
    return (tx ?? db).select().from(product_variants).where(eq(product_variants.product_id, product_id));
  }

  static async getLastDisplayOrder(product_id: number) {
    const results = await db
      .select({ display_order: product_variants.display_order })
      .from(product_variants)
      .where(and(eq(product_variants.product_id, product_id), eq(product_variants.status, "active")))
      .orderBy(desc(product_variants.display_order))
      .limit(1)
      .prepare()
      .execute();
    if (!results || results.length === 0) return 0;
    return results[0].display_order;
  }

  static async getOptions(variant_id: number) {
    return db
      .select({
        variant_option_id: variant_options.variant_option_id,
        dropdown_name: variant_options.dropdown_name,
        creates_po: variant_options.creates_po,
      })
      .from(variant_options)
      .where(eq(variant_options.variant_id, variant_id))
      .orderBy(variant_options.display_order)
      .prepare()
      .execute();
  }

  static async getOptionValues(variant_option_id: number) {
    return db
      .select({
        value: variant_option_values.value,
        additional_price: variant_option_values.additional_price,
        sku: variant_option_values.sku,
        is_default: variant_option_values.is_default,
      })
      .from(variant_option_values)
      .where(eq(variant_option_values.variant_option_id, variant_option_id))
      .orderBy(variant_option_values.display_order)
      .prepare()
      .execute();
  }

  static async create(data: NewVariant) {
    return db.insert(product_variants).values(data).prepare().execute();
  }

  static async reorder(display_order: number, variant_id: number, product_id: number) {
    return db
      .update(product_variants)
      .set({ display_order })
      .where(
        and(
          eq(product_variants.product_id, product_id),
          eq(product_variants.variant_id, variant_id),
          eq(product_variants.status, "active"),
        ),
      )
      .prepare()
      .execute();
  }

  static async disable(product_id: number, variant_id: number) {
    return db
      .update(product_variants)
      .set({ status: "inactive" })
      .where(and(eq(product_variants.product_id, product_id), eq(product_variants.variant_id, variant_id)))
      .prepare()
      .execute();
  }

  static async delete(product_id: number, variant_id: number) {
    return db
      .delete(product_variants)
      .where(and(eq(product_variants.product_id, product_id), eq(product_variants.variant_id, variant_id)))
      .prepare()
      .execute();
  }

  static async deleteManyByProductID(product_id: number, tx?: Transaction) {
    return (tx ?? db).delete(product_variants).where(eq(product_variants.product_id, product_id));
  }
}