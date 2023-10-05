import type { NewProduct } from "~/core/domain/products/entity";
import type { Transaction } from "~/core/domain/types";
import { and, eq, like, ne } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { variant_option_values } from "~/schema/product-variants";
import { product_group_link, product_tag_link, products } from "~/schema/products";

export class ProductsDS {
  static async getAll() {
    return db.select().from(products).where(ne(products.status, "inactive")).prepare().execute();
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

  static async create(new_product: NewProduct, tx?: Transaction) {
    return (tx ?? db).insert(products).values(new_product).prepare().execute();
  }

  static async createMany(new_products: NewProduct[], tx?: Transaction) {
    return (tx ?? db).insert(products).values(new_products).prepare().execute();
  }

  static async addGroup(product_id: number, group_id: number, tx?: Transaction) {
    return (tx ?? db).insert(product_group_link).values({ product_id, group_id }).prepare().execute();
  }

  static async enable(product_id: number) {
    return db
      .update(products)
      .set({ status: "draft" })
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

  static async delete(product_id: number) {
    return db
      .delete(products)
      .where(and(eq(products.product_id, product_id), eq(products.status, "inactive")))
      .prepare()
      .execute();
  }

  static async deleteGroups(product_id: number, tx?: Transaction) {
    return (tx ?? db).delete(product_group_link).where(eq(product_group_link.product_id, product_id)).prepare().execute();
  }

  static async deleteOptionValues(product_id: number, tx?: Transaction) {
    return (tx ?? db).delete(variant_option_values).where(eq(variant_option_values.product_id, product_id)).prepare().execute();
  }

  static async deleteTags(product_id: number, tx?: Transaction) {
    return (tx ?? db).delete(product_tag_link).where(eq(product_tag_link.product_id, product_id)).prepare().execute();
  }
}
