import type { NewProduct } from "~/core/domain/products/entity";
import type { Transaction } from "~/core/domain/types";
import { and, eq, ne } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { bundle_group_link, bundles } from "~/schema/bundles";

export class BundlesDS {
  static async getByID(bundle_id: number) {
    const results = await db
      .select()
      .from(bundles)
      .where(and(ne(bundles.status, "inactive"), eq(bundles.bundle_id, bundle_id)))
      .limit(1)
      .prepare()
      .execute();
    if (!results || results.length === 0) return null;
    return results[0];
  }

  static async getAll() {
    return db.select().from(bundles).where(ne(bundles.status, "inactive")).prepare().execute();
  }

  static async create(new_product: NewProduct, tx?: Transaction) {
    if (tx) return tx.insert(bundles).values(new_product).prepare().execute();
    return db.insert(bundles).values(new_product).prepare().execute();
  }

  static async createMany(new_products: NewProduct[], tx?: Transaction) {
    if (tx) return tx.insert(bundles).values(new_products).prepare().execute();
    return db.insert(bundles).values(new_products).prepare().execute();
  }

  static async addGroup(bundle_id: number, group_id: number, tx?: Transaction) {
    if (tx) return tx.insert(bundle_group_link).values({ bundle_id, group_id }).prepare().execute();
    return db.insert(bundle_group_link).values({ bundle_id, group_id }).prepare().execute();
  }
}
