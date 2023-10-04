import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { bundle_group_link } from "~/schema/bundles";
import { groups } from "~/schema/groups";
import { product_group_link } from "~/schema/products";

export class GroupsDS {
  static async getGroupByProductID(product_id: number) {
    return db
      .select({ group_id: groups.group_id, name: groups.name })
      .from(groups)
      .innerJoin(product_group_link, eq(product_group_link.group_id, groups.group_id))
      .where(and(eq(product_group_link.product_id, product_id), isNull(groups.parent_group_id)))
      .prepare()
      .execute();
  }

  static async getGroupByBundleID(bundle_id: number) {
    return db
      .select({ group_id: groups.group_id, name: groups.name })
      .from(groups)
      .innerJoin(bundle_group_link, eq(bundle_group_link.group_id, groups.group_id))
      .where(and(eq(bundle_group_link.bundle_id, bundle_id), isNull(groups.parent_group_id)))
      .prepare()
      .execute();
  }

  static async getSubgroupByProductID(product_id: number) {
    return db
      .select({ group_id: groups.group_id, name: groups.name, parent_group_id: groups.parent_group_id })
      .from(groups)
      .innerJoin(product_group_link, eq(product_group_link.group_id, groups.group_id))
      .where(and(eq(product_group_link.product_id, product_id), isNotNull(groups.parent_group_id)))
      .prepare()
      .execute();
  }

  static async getSubgroupByBundleID(bundle_id: number) {
    return db
      .select({ group_id: groups.group_id, name: groups.name, parent_group_id: groups.parent_group_id })
      .from(groups)
      .innerJoin(bundle_group_link, eq(bundle_group_link.group_id, groups.group_id))
      .where(and(eq(bundle_group_link.bundle_id, bundle_id), isNotNull(groups.parent_group_id)))
      .prepare()
      .execute();
  }
}
