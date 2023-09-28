import type { NewVariant } from "~/core/domain/variants/entity";
import { and, eq } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { product_variants, variant_option_values, variant_options } from "~/schema/products";

export class VariantsDS {
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
      .where(and(eq(product_variants.active, 1), eq(product_variants.product_id, product_id)))
      .prepare()
      .execute();
  }

  static async getOptions(variant_id: number) {
    return db
      .select({
        variant_option_id: variant_options.variant_option_id,
        name: variant_options.dropdown_name,
        product_exists: variant_options.product_exists,
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
        name: variant_option_values.value,
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

  static async disableVariant(product_id: number, variant_id: number) {
    return db
      .update(product_variants)
      .set({ active: 0 })
      .where(and(eq(product_variants.product_id, product_id), eq(product_variants.variant_id, variant_id)))
      .prepare()
      .execute();
  }
}
