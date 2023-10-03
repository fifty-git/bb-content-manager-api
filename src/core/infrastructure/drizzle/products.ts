import type { NewProduct } from "~/core/domain/products/entity";
import type { Transaction } from "~/core/domain/types";
import { and, eq, like, ne } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { product_group_link, products } from "~/schema/products";

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
    if (tx) return tx.insert(products).values(new_product).prepare().execute();
    return db.insert(products).values(new_product).prepare().execute();
  }

  static async createMany(new_products: NewProduct[], tx?: Transaction) {
    if (tx) return tx.insert(products).values(new_products).prepare().execute();
    return db.insert(products).values(new_products).prepare().execute();
  }

  static async addGroup(product_id: number, group_id: number, tx?: Transaction) {
    if (tx) return tx.insert(product_group_link).values({ product_id, group_id }).prepare().execute();
    return db.insert(product_group_link).values({ product_id, group_id }).prepare().execute();
  }
}
