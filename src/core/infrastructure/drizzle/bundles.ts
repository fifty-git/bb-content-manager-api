import type { NewProduct } from "~/core/domain/products/entity";
import type { Transaction } from "~/core/domain/types";
import { ne } from "drizzle-orm/index";
import { db } from "~/modules/drizzle";
import { bundle_group_link, bundles } from "~/schema/bundles";

export class BundlesDS {
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
