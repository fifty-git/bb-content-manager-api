import type { NewSubgroup, UpdateSubgroup } from "~/core/domain/groups/entity";
import type { Transaction } from "~/core/domain/types";
import { eq, sql } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { groups } from "~/schema/groups";
import { product_group_link, products } from "~/schema/products";
import { subgroups } from "~/schema/subgroups";

export class SubgroupsDS {
  static async getByParentGroupID(parent_group_id: number) {
    return db
      .select({ subgroup_id: subgroups.subgroup_id, name: subgroups.name, status: subgroups.status })
      .from(subgroups)
      .where(eq(subgroups.parent_group_id, parent_group_id))
      .prepare()
      .execute();
  }

  static async getProductsBySubgroupID(subgroup_id: number) {
    return db
      .select({
        product_id: products.product_id,
        name: products.name,
        product_type: products.product_type,
        status: products.status,
      })
      .from(products)
      .innerJoin(product_group_link, eq(product_group_link.product_id, products.product_id))
      .where(eq(product_group_link.subgroup_id, subgroup_id))
      .prepare()
      .execute();
  }

  static async createSubgroup(newSubgroup: NewSubgroup, tx?: Transaction) {
    if (tx) return tx.insert(groups).values(newSubgroup).onDuplicateKeyUpdate({ set: newSubgroup }).prepare().execute();
    return db
      .insert(subgroups)
      .values(newSubgroup)
      .onDuplicateKeyUpdate({ set: { subgroup_id: sql`subgroup_id` } })
      .prepare()
      .execute();
  }

  static async deleteSubgroup(subgroup_id: number) {
    const prepared = db.delete(subgroups).where(eq(subgroups.subgroup_id, subgroup_id));
    const results = await prepared.execute();
    return results[0];
  }

  static async updateSubgroup(subgroup_id: number, subgroup: UpdateSubgroup) {
    const prepared = db.update(subgroups).set(subgroup).where(eq(subgroups.subgroup_id, subgroup_id)).prepare();
    const results = await prepared.execute();
    return results[0];
  }

  static async getSubgroupById(subgroupID: number) {
    const results = await db
      .select({
        group_id: subgroups.subgroup_id,
        name: subgroups.name,
        parent_group_id: subgroups.parent_group_id,
        status: subgroups.status,
      })
      .from(subgroups)
      .where(eq(subgroups.subgroup_id, subgroupID)) // Filtrar por group_id y parent_group_id
      .prepare()
      .execute();
    if (!results || results.length === 0) return null;
    return results[0];
  }

  static async activateSubgroup(subgroupID: number) {
    const prepared = db.update(subgroups).set({ status: "active" }).where(eq(subgroups.subgroup_id, subgroupID)).prepare();
    const results = await prepared.execute();
    return results[0];
  }

  static async activateSubgroups(parentGroupId: number) {
    const prepared = db.update(subgroups).set({ status: "active" }).where(eq(subgroups.parent_group_id, parentGroupId)).prepare();
    const results = await prepared.execute();
    return results[0];
  }

  static async deactivateSubgroup(subgroup_id: number) {
    return db.transaction(async (tx) => {
      const productStatus = await tx
        .select({ id: products.product_id, name: products.name, status: products.status })
        .from(products)
        .innerJoin(product_group_link, eq(product_group_link.product_id, products.product_id))
        .where(eq(product_group_link.subgroup_id, subgroup_id));
      const activeProducts = productStatus.filter((status: any) => status != "inactive");
      if (activeProducts.length) {
        return null;
      }
      return await tx.update(subgroups).set({ status: "inactive" }).where(eq(subgroups.subgroup_id, subgroup_id)).prepare().execute();
    });
  }
}
