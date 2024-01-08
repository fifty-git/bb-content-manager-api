import type { CreateGroup } from "~/core/domain/groups/types";
import type { Transaction } from "~/core/domain/types";
import { and, eq } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { groups } from "~/schema/groups";
import { product_group_link } from "~/schema/products";
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

  static async getByGroupID(group_id: number) {
    const results = await db
      .select({ group_id: groups.group_id, name: groups.name, status: groups.status })
      .from(groups)
      .where(eq(groups.group_id, group_id))
      .prepare()
      .execute();
    if (!results || results.length === 0) return null;
    return results[0];
  }

  static async getSubgroupsByGroupID(parent_group_id: number) {
    return db
      .select({
        subgroup_id: subgroups.subgroup_id,
        name: subgroups.name,
        parent_group_id: subgroups.parent_group_id,
        status: subgroups.status,
      })
      .from(subgroups)
      .where(eq(subgroups.parent_group_id, parent_group_id))
      .prepare()
      .execute();
  }

  static async getSubgroupByGroupID(parent_group_id: number, subgroup_id: number) {
    const results = await db
      .select({ subgroup_id: subgroups.subgroup_id, name: subgroups.name, parent_group_id: subgroups.parent_group_id })
      .from(subgroups)
      .where(and(eq(subgroups.subgroup_id, subgroup_id), eq(subgroups.parent_group_id, parent_group_id)))
      .prepare()
      .execute();
    if (!results || results.length === 0) return null;
    return results[0];
  }

  static async getByProductID(product_id: number) {
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

  static async createGroup(newGroup: CreateGroup, tx?: Transaction) {
    if (tx) return tx.insert(groups).values(newGroup).prepare().execute();
    return db.insert(groups).values(newGroup).prepare().execute();
  }

  static async updateGroup(group_id: number, name: string) {
    return db.update(groups).set({ name }).where(eq(groups.group_id, group_id)).prepare().execute();
  }

  static async activate(group_id: number) {
    return db.update(groups).set({ status: "active" }).where(eq(groups.group_id, group_id)).prepare().execute();
  }

  static async deactivate(group_id: number) {
    return db.update(groups).set({ status: "inactive" }).where(eq(groups.group_id, group_id)).prepare().execute();
  }

  static async delete(group_id: number, tx?: Transaction) {
    return (tx ?? db).delete(groups).where(eq(groups.group_id, group_id)).prepare().execute();
  }
}
