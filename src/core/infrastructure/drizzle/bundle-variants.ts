import type { NewBundleVariant } from "~/core/domain/bundle-variants/entity";
import { and, desc, eq } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { bundle_variant_option_values, bundle_variant_options } from "~/schema/bundle-variants";
import { bundle_variants } from "~/schema/bundles";

export class BundleVariantsDS {
  static async getAll(bundle_id: number) {
    return db
      .select({
        bundle_variant_id: bundle_variants.bundle_variant_id,
        name: bundle_variants.name,
        price: bundle_variants.price,
        units: bundle_variants.units,
        measure_units: bundle_variants.measure_units,
        upc: bundle_variants.upc,
      })
      .from(bundle_variants)
      .where(and(eq(bundle_variants.status, "active"), eq(bundle_variants.bundle_id, bundle_id)))
      .orderBy(bundle_variants.display_order)
      .prepare()
      .execute();
  }

  static async getLastDisplayOrder(bundle_id: number) {
    const results = await db
      .select({ display_order: bundle_variants.display_order })
      .from(bundle_variants)
      .where(and(eq(bundle_variants.bundle_id, bundle_id), eq(bundle_variants.status, "active")))
      .orderBy(desc(bundle_variants.display_order))
      .limit(1)
      .prepare()
      .execute();
    if (!results || results.length === 0) return 0;
    return results[0].display_order;
  }

  static async getOptions(bundle_variant_id: number) {
    return db
      .select({
        variant_option_id: bundle_variant_options.bvo_id,
        dropdown_name: bundle_variant_options.dropdown_name,
        creates_po: bundle_variant_options.creates_po,
      })
      .from(bundle_variant_options)
      .where(eq(bundle_variant_options.bundle_variant_id, bundle_variant_id))
      .orderBy(bundle_variant_options.display_order)
      .prepare()
      .execute();
  }

  static async getOptionValues(variant_option_id: number) {
    return db
      .select({
        value: bundle_variant_option_values.value,
        additional_price: bundle_variant_option_values.additional_price,
        is_default: bundle_variant_option_values.is_default,
      })
      .from(bundle_variant_option_values)
      .where(eq(bundle_variant_option_values.bvo_id, variant_option_id))
      .orderBy(bundle_variant_option_values.display_order)
      .prepare()
      .execute();
  }

  static async create(data: NewBundleVariant) {
    return db.insert(bundle_variants).values(data).prepare().execute();
  }

  static async reorder(display_order: number, bundle_variant_id: number, bundle_id: number) {
    return db
      .update(bundle_variants)
      .set({ display_order })
      .where(
        and(
          eq(bundle_variants.bundle_id, bundle_id),
          eq(bundle_variants.bundle_variant_id, bundle_variant_id),
          eq(bundle_variants.status, "active"),
        ),
      )
      .prepare()
      .execute();
  }

  static async disable(bundle_id: number, bundle_variant_id: number) {
    return db
      .update(bundle_variants)
      .set({ status: "inactive" })
      .where(and(eq(bundle_variants.bundle_id, bundle_id), eq(bundle_variants.bundle_variant_id, bundle_variant_id)))
      .prepare()
      .execute();
  }

  static async delete(bundle_id: number, bundle_variant_id: number) {
    return db
      .delete(bundle_variants)
      .where(and(eq(bundle_variants.bundle_id, bundle_id), eq(bundle_variants.bundle_variant_id, bundle_variant_id)))
      .prepare()
      .execute();
  }
}
