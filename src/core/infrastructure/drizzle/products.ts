import {db} from "~/modules/drizzle";
import {products} from "~/schema/products";
import {eq} from "drizzle-orm";

export class ProductsDS {
  static async getAll(){
    const prepared = db.select().from(products).prepare();
    return prepared.execute();
  }
  static async getByID(product_id: number) {
    const prepared = db.select().from(products).where(eq(products.product_id, product_id)).prepare();
    const result = await prepared.execute();
    if(!result || result.length ===0) return null;
    return result[0];
  }
  static async getVarieties(product_id: number) {

  }
}