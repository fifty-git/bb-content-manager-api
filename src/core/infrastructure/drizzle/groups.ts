import type { NewGroup, UpdateGroup } from "~/core/domain/groups/entity";
import type { Transaction } from "~/core/domain/types";
import { and, eq } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { groups } from "~/schema/groups";
import { product_group_link, products } from "~/schema/products";
import { subgroups } from "~/schema/subgroups";

export class GroupsDS {
  static async getAll() {
    return db
      .select({
        group_id: groups.group_id,
        name: groups.name,
        status: groups.status,
      })
      .from(groups)
      .prepare()
      .execute();
  }

  static async getProductsByGroupID(group_id: number) {
    return db
      .select({
        product_id: products.product_id,
        name: products.name,
        product_type: products.product_type,
        status: products.status,
      })
      .from(products)
      .innerJoin(product_group_link, eq(product_group_link.product_id, products.product_id))
      .innerJoin(subgroups, eq(subgroups.subgroup_id, product_group_link.subgroup_id))
      .where(eq(subgroups.parent_group_id, group_id))
      .prepare()
      .execute();
  }

  static async updateGroup(group_id: number, group: UpdateGroup) {
    const prepared = db.update(groups).set(group).where(eq(groups.group_id, group_id)).prepare();
    const results = await prepared.execute();
    return results[0];
  }

  static async activate(group_id: number) {
    return db.update(groups).set({ status: "active" }).where(eq(groups.group_id, group_id)).prepare().execute();
  }

  static async deactivate(group_id: number) {
    return db.update(groups).set({ status: "inactive" }).where(eq(groups.group_id, group_id)).prepare().execute();
  }

  static async createGroup(newGroup: NewGroup, tx?: Transaction) {
    if (tx) return tx.insert(groups).values(newGroup).prepare().execute();
    return db.insert(groups).values(newGroup).prepare().execute();
  }

  static async getSubgroupById(parentGroupId: number, subgroupID: number) {
    const results = await db
      .select({ group_id: subgroups.subgroup_id, name: subgroups.name, parent_group_id: subgroups.parent_group_id })
      .from(subgroups)
      .where(and(eq(subgroups.subgroup_id, subgroupID), eq(subgroups.parent_group_id, parentGroupId))) // Filtrar por group_id y parent_group_id
      .prepare()
      .execute();
    if (!results || results.length === 0) return null;
    return results[0];
  }

  static async getGroupById(group_id: number) {
    const results = await db
      .select({ group_id: groups.group_id, name: groups.name, status: groups.status })
      .from(groups)
      .where(eq(groups.group_id, group_id))
      .prepare()
      .execute();
    if (!results || results.length === 0) return null;
    return results[0];
  }

  static async getGroupByProductID(product_id: number) {
    const results = await db
      .select({
        group_id: groups.group_id,
        group_name: groups.name,
        subgroup_id: product_group_link.subgroup_id,
        subgroup_name: subgroups.name,
      })
      .from(product_group_link)
      .innerJoin(subgroups, eq(subgroups.subgroup_id, product_group_link.subgroup_id))
      .innerJoin(groups, eq(groups.group_id, subgroups.parent_group_id))
      .where(eq(product_group_link.product_id, product_id))
      .prepare()
      .execute();
    if (!results || results.length === 0) return null;
    return results[0];
  }

  static async delete(group_id: number, tx?: Transaction) {
    return (tx ?? db).delete(groups).where(eq(groups.group_id, group_id)).prepare().execute();
  }
}
