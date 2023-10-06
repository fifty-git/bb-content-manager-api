import type { Transaction } from "~/core/domain/types";
import { eq } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { product_varieties } from "~/schema/products";

export class ProductVarietiesDS {
  static async deleteManyByProductID(product_id: number, tx?: Transaction) {
    return (tx ?? db).delete(product_varieties).where(eq(product_varieties.product_id, product_id)).prepare().execute();
  }
}
