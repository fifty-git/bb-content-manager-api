import type { CreateSubgroup } from "~/core/domain/subgroups/types";
import type { Transaction } from "~/core/domain/types";
import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { subgroups } from "~/schema/subgroups";

export class SubgroupsDS {
  static async getAll() {
    return db
      .select({ subgroup_id: subgroups.subgroup_id, name: subgroups.name, status: subgroups.status })
      .from(subgroups)
      .prepare()
      .execute();
  }

  static async getByID(subgroup_id: number) {
    const results = await db
      .select({
        group_id: subgroups.subgroup_id,
        name: subgroups.name,
        parent_group_id: subgroups.parent_group_id,
        status: subgroups.status,
      })
      .from(subgroups)
      .where(eq(subgroups.subgroup_id, subgroup_id))
      .prepare()
      .execute();
    if (!results || results.length === 0) return null;
    return results[0];
  }

  static async getByParentGroupID(parent_group_id: number) {
    return db
      .select({ subgroup_id: subgroups.subgroup_id, name: subgroups.name, status: subgroups.status })
      .from(subgroups)
      .where(eq(subgroups.parent_group_id, parent_group_id))
      .prepare()
      .execute();
  }

  static async createSubgroup(subgroup: CreateSubgroup, tx?: Transaction) {
    return (tx ?? db)
      .insert(subgroups)
      .values(subgroup)
      .onDuplicateKeyUpdate({ set: { subgroup_id: sql`subgroup_id` } })
      .prepare()
      .execute();
  }

  static async updateSubgroup(subgroup_id: number, name: string, parent_group_id: number, new_parent_group_id: number) {
    return db
      .update(subgroups)
      .set({ name, parent_group_id: new_parent_group_id })
      .where(and(eq(subgroups.subgroup_id, subgroup_id), eq(subgroups.parent_group_id, parent_group_id)))
      .prepare()
      .execute();
  }

  static async activate(subgroup_id: number) {
    return db.update(subgroups).set({ status: "active" }).where(eq(subgroups.subgroup_id, subgroup_id)).prepare().execute();
  }

  static async activateByGroupID(group_id: number) {
    return db.update(subgroups).set({ status: "active" }).where(eq(subgroups.parent_group_id, group_id)).prepare().execute();
  }

  static async deactivate(subgroup_id: number) {
    return db.update(subgroups).set({ status: "inactive" }).where(eq(subgroups.subgroup_id, subgroup_id)).prepare().execute();
  }

  static async deactivateMany(subgroup_ids: number[], tx?: Transaction) {
    if (subgroup_ids.length === 0) return;
    return (tx ?? db).update(subgroups).set({ status: "inactive" }).where(inArray(subgroups.subgroup_id, subgroup_ids)).prepare().execute();
  }

  static async deleteSubgroup(subgroup_id: number) {
    const prepared = db.delete(subgroups).where(eq(subgroups.subgroup_id, subgroup_id));
    const results = await prepared.execute();
    return results[0];
  }

  static async deleteMany(subgroup_ids: number[], tx?: Transaction) {
    if (subgroup_ids.length === 0) return;
    return (tx ?? db).delete(subgroups).where(inArray(subgroups.subgroup_id, subgroup_ids)).prepare().execute();
  }
}
