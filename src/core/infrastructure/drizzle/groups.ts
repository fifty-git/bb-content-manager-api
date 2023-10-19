import type { NewGroup, UpdateGroup } from "~/core/domain/groups/entity";
import type { Transaction } from "~/core/domain/types";
import { and, eq, inArray, isNotNull, isNull } from "drizzle-orm";
import { alias } from "drizzle-orm/mysql-core";
import { db } from "~/modules/drizzle";
import { bundle_group_link } from "~/schema/bundles";
import { groups } from "~/schema/groups";
import { product_group_link } from "~/schema/products";

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
        await tx.update(groups).set({ status: "inactive" }).where(inArray(groups.group_id, subGroupsIDs)).prepare().execute();
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
      .select({ group_id: groups.group_id, name: groups.name, parent_group_id: groups.parent_group_id })
      .from(groups)
      .where(and(eq(groups.group_id, subgroupID), eq(groups.parent_group_id, parentGroupId))) // Filtrar por group_id y parent_group_id
      .prepare()
      .execute();
    if (!results || results.length === 0) return null;
    return results[0];
  }

  static async getSubgroupsByParentGroupId(parentGroupId: number) {
    return db
      .select({ group_id: groups.group_id, name: groups.name, parent_group_id: groups.parent_group_id })
      .from(groups)
      .where(eq(groups.parent_group_id, parentGroupId))
      .prepare()
      .execute();
  }

  static async getGroupById(group_id: number) {
    const groups2 = alias(groups, "group2");
    return db
      .select({ group_id: groups.group_id, name: groups.name, parent_group_id: groups.parent_group_id, parent_group_name: groups2.name })
      .from(groups)
      .leftJoin(groups2, eq(groups.parent_group_id, groups2.group_id))
      .where(eq(groups.group_id, group_id)) // Filtrar por group_id
      .prepare()
      .execute();
  }

  static async getAll() {
    const groups2 = alias(groups, "group2");
    return db
      .select({
        group_id: groups.group_id,
        name: groups.name,
        parent_group_id: groups.parent_group_id,
        parent_group_name: groups2.name,
        status: groups.status,
      })
      .from(groups)
      .leftJoin(groups2, eq(groups.parent_group_id, groups2.group_id))
      .prepare()
      .execute();
  }

  static async getGroupByProductID(product_id: number) {
    const results = await db
      .select({ group_id: groups.group_id, name: groups.name })
      .from(groups)
      .innerJoin(product_group_link, eq(product_group_link.group_id, groups.group_id))
      .where(and(eq(product_group_link.product_id, product_id), isNull(groups.parent_group_id)))
      .limit(1)
      .prepare()
      .execute();
    if (!results || results.length === 0) return null;
    return results[0];
  }

  static async getGroupByBundleID(bundle_id: number) {
    const results = await db
      .select({ group_id: groups.group_id, name: groups.name })
      .from(groups)
      .innerJoin(bundle_group_link, eq(bundle_group_link.group_id, groups.group_id))
      .where(and(eq(bundle_group_link.bundle_id, bundle_id), isNull(groups.parent_group_id)))
      .limit(1)
      .prepare()
      .execute();
    if (!results || results.length === 0) return null;
    return results[0];
  }

  static async getSubgroupByProductID(product_id: number) {
    const results = await db
      .select({ group_id: groups.group_id, name: groups.name, parent_group_id: groups.parent_group_id })
      .from(groups)
      .innerJoin(product_group_link, eq(product_group_link.group_id, groups.group_id))
      .where(and(eq(product_group_link.product_id, product_id), isNotNull(groups.parent_group_id)))
      .limit(1)
      .prepare()
      .execute();
    if (!results || results.length === 0) return null;
    return results[0];
  }

  static async getSubgroupByBundleID(bundle_id: number) {
    const results = await db
      .select({ group_id: groups.group_id, name: groups.name, parent_group_id: groups.parent_group_id })
      .from(groups)
      .innerJoin(bundle_group_link, eq(bundle_group_link.group_id, groups.group_id))
      .where(and(eq(bundle_group_link.bundle_id, bundle_id), isNotNull(groups.parent_group_id)))
      .limit(1)
      .prepare()
      .execute();
    if (!results || results.length === 0) return null;
    return results[0];
  }
}
