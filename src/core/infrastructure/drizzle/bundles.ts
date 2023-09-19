import type { NewProduct } from "~/core/domain/products/entity";
import { db } from "~/modules/drizzle";
import { bundles } from "~/schema/bundles";

export class BundlesDS {
  static async create(new_product: NewProduct) {
    const prepared = db.insert(bundles).values(new_product).prepare();
    return prepared.execute();
  }

  static async createMany(new_products: NewProduct[]) {
    const prepared = db.insert(bundles).values(new_products).prepare();
    return prepared.execute();
  }

  static async addGroup(bundle_id: number, group_id: number) {

  }
}
