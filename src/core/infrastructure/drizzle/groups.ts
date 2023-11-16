import type { NewGroup, NewSubgroup, UpdateGroup, UpdateSubgroup } from "~/core/domain/groups/entity";
import type { Transaction } from "~/core/domain/types";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { groups } from "~/schema/groups";
import { products } from "~/schema/products";
import { subgroups } from "~/schema/subgroups";

export class SubGroupDS {
  static async createSugroup(newSubgroup: NewSubgroup, tx?: Transaction) {
    if (tx) return tx.insert(groups).values(newSubgroup).prepare().execute();
    return db.insert(subgroups).values(newSubgroup).prepare().execute();
  }

  static async updateSubgroup(subgroup_id: number, subgroup: UpdateSubgroup) {
    const prepared = db.update(subgroups).set(subgroup).where(eq(subgroups.subgroup_id, subgroup_id)).prepare();
    const results = await prepared.execute();
    return results[0];
  }

  static async getSubgroupById(subgroupID: number) {
    const results = await db
      .select({ group_id: subgroups.subgroup_id, name: subgroups.name, parent_group_id: subgroups.parent_group_id })
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
      await tx.update(subgroups).set({ status: "inactive" }).where(eq(subgroups.subgroup_id, subgroup_id)).prepare().execute();
    });
  }

  static async getSubgroupByProductID(product_id: number) {
    const results = await db
      .select({
        subgroup_id: subgroups.subgroup_id,
        name: subgroups.name,
        parent_group_id: subgroups.parent_group_id,
        status: subgroups.status,
      })
      .from(subgroups)
      .innerJoin(products, eq(products.subgroup_id, subgroups.subgroup_id))
      .where(eq(products.product_id, product_id))
      .limit(1)
      .prepare()
      .execute();
    if (!results || results.length === 0) return null;
    return results[0];
  }
}

export class GroupsDS {
  static async updateGroup(group_id: number, group: UpdateGroup) {
    const prepared = db.update(groups).set(group).where(eq(groups.group_id, group_id)).prepare();
    const results = await prepared.execute();
    return results[0];
  }

  static async activateGroup(group_id: number) {
    const prepared = db.update(groups).set({ status: "active" }).where(eq(groups.group_id, group_id)).prepare();
    const results = await prepared.execute();
    return results[0];
  }

  static async deactivateGroup(group_id: number) {
    const subGroups = await GroupsDS.getSubgroupsByParentGroupId(group_id);
    const subGroupsIDs = subGroups.map((group) => group.group_id);
    return db.transaction(async (tx) => {
      if (subGroupsIDs.length) {
        await tx.update(subgroups).set({ status: "inactive" }).where(inArray(subgroups.subgroup_id, subGroupsIDs)).prepare().execute();
      }
      await tx.update(groups).set({ status: "inactive" }).where(eq(groups.group_id, group_id)).prepare().execute();
    });
  }

  static async deleteGroup(group_id: number) {
    const subGroups = await GroupsDS.getSubgroupsByParentGroupId(group_id);
    const subGroupsIDs = subGroups.map((group) => group.group_id);
    return db.transaction(async (tx) => {
      if (subGroupsIDs.length) {
        await tx.delete(groups).where(inArray(groups.group_id, subGroupsIDs)).prepare().execute();
      }
      await tx.delete(groups).where(eq(groups.group_id, group_id)).prepare().execute();
    });
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

  static async getSubgroupsByParentGroupId(parentGroupId: number) {
    return db
      .select({ group_id: subgroups.subgroup_id, subgroups: subgroups.name, parent_group_id: subgroups.parent_group_id })
      .from(subgroups)
      .where(eq(subgroups.parent_group_id, parentGroupId))
      .prepare()
      .execute();
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

  static async getAllGroups() {
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
}
