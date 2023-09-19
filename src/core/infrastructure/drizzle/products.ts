import type { NewProduct } from "~/core/domain/products/entity";
import { eq } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { product_group_link, products } from "~/schema/products";

export class ProductsDS {
  static async getAll() {
    const prepared = db.select().from(products).prepare();
    return prepared.execute();
  }

  static async getByID(product_id: number) {
    const prepared = db.select().from(products).where(eq(products.product_id, product_id)).prepare();
    const result = await prepared.execute();
    if (!result || result.length === 0) return null;
    return result[0];
  }

  static async create(new_product: NewProduct) {
    const prepared = db.insert(products).values(new_product).prepare();
    return prepared.execute();
  }

  static async createMany(new_products: NewProduct[]) {
    const prepared = db.insert(products).values(new_products).prepare();
    return prepared.execute();
  }

  static async addGroup(product_id: number, group_id: number) {
    const prepared = db.insert(product_group_link).values({ product_id, group_id }).prepare();
    return prepared.execute();
  }
}
