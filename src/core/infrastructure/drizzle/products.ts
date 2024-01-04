import type { NewProduct } from "~/core/domain/products/entity";
import type { Transaction } from "~/core/domain/types";
import { and, eq, inArray, like, ne } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { variant_option_values } from "~/schema/product-variants";
import { product_group_link, product_tag_link, products } from "~/schema/products";

export class ProductsDS {
  static async getAll() {
    return db.select().from(products).prepare().execute();
  }

  static async findByName(name: string, limit = 10) {
    return db
      .select()
      .from(products)
      .where(and(ne(products.status, "inactive"), like(products.name, `%${name}%`)))
      .limit(limit)
      .prepare()
      .execute();
  }

  static async getByID(product_id: number) {
    const result = await db.select().from(products).where(eq(products.product_id, product_id)).prepare().execute();
    if (!result || result.length === 0) return null;
    return result[0];
  }

  static async getBySubgroupIDs(subgroup_ids: number[], status: "inactive" | "active") {
    if (subgroup_ids.length === 0) return [];
    return db
      .select({ product_id: products.product_id })
      .from(products)
      .innerJoin(product_group_link, eq(product_group_link.product_id, products.product_id))
      .where(and(inArray(product_group_link.subgroup_id, subgroup_ids), eq(products.status, status)))
      .prepare()
      .execute();
  }

  static async create(new_product: NewProduct, tx?: Transaction) {
    return (tx ?? db).insert(products).values(new_product).prepare().execute();
  }

  static async createMany(new_products: NewProduct[], tx?: Transaction) {
    return (tx ?? db).insert(products).values(new_products).prepare().execute();
  }

  static async addSubgroup(product_id: number, subgroup_id: number, tx?: Transaction) {
    return (tx ?? db).insert(product_group_link).values({ product_id, subgroup_id }).prepare().execute();
  }

  static async addSubgroups(productsGroups: { product_id: number; subgroup_id: number }[], tx?: Transaction) {
    return (tx ?? db).insert(product_group_link).values(productsGroups).prepare().execute();
  }

  static async deleteGroup(product_id: number, tx?: Transaction) {
    return (tx ?? db).delete(product_group_link).where(eq(product_group_link.product_id, product_id)).prepare().execute();
  }

  static async deleteGroups(product_ids: number[], tx?: Transaction) {
    return (tx ?? db).delete(product_group_link).where(inArray(product_group_link.product_id, product_ids));
  }

  static async enable(product_id: number) {
    return db
      .update(products)
      .set({ status: "active" })
      .where(and(eq(products.product_id, product_id), eq(products.status, "inactive")))
      .prepare()
      .execute();
  }

  static async disable(product_id: number) {
    return db
      .update(products)
      .set({ status: "inactive" })
      .where(and(eq(products.product_id, product_id), ne(products.status, "inactive")))
      .prepare()
      .execute();
  }

  static async delete(product_id: number, tx?: Transaction) {
    return (tx ?? db)
      .delete(products)
      .where(and(eq(products.product_id, product_id), eq(products.status, "inactive")))
      .prepare()
      .execute();
  }

  static async deleteOptionValues(product_id: number, tx?: Transaction) {
    return (tx ?? db).delete(variant_option_values).where(eq(variant_option_values.product_id, product_id)).prepare().execute();
  }

  static async deleteTags(product_id: number, tx?: Transaction) {
    return (tx ?? db).delete(product_tag_link).where(eq(product_tag_link.product_id, product_id)).prepare().execute();
  }
}
