import type { Group, Subgroup } from "~/core/domain/groups/entity";
import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { GroupsDS } from "~/core/infrastructure/drizzle/groups";
import { ProductsDS } from "~/core/infrastructure/drizzle/products";
import { SubgroupsDS } from "~/core/infrastructure/drizzle/subgroups";
import { db } from "~/modules/drizzle";
import { NewSubGroupSchema } from "../domain/groups/validator/create-subgroup-validator";

async function addReferencesToSubgroups(subgroups: Subgroup[]) {
  return Promise.all(
    subgroups.map(async (subgroup) => {
      const refs = await SubgroupsDS.getProductsBySubgroupID(subgroup.subgroup_id);
      return { ...subgroup, product_references: refs.length };
    }),
  );
}

async function addSubgroupsToGroups(groups: Group[]) {
  return Promise.all(
    groups.map(async (group) => {
      const _subgroups = await SubgroupsDS.getByParentGroupID(group.group_id);
      const subgroups = await addReferencesToSubgroups(_subgroups);
      return { ...group, subgroups };
    }),
  );
}

export async function getAll(c: Context<EnvAPI>) {
  const _groups = await GroupsDS.getAll();
  const groups = await addSubgroupsToGroups(_groups);
  return c.json({ status: "success", data: groups });
}

/* --------------- Groups ----------------- */

// export async function getProductsByGroup(c: Context<EnvAPI>) {
//   const groupId = parseInt(c.req.param("group_id"), 10);
//   const group = await GroupsDS.getGroupById(groupId);
//   if (!group) return c.json({ msg: "Group not found" }, 404);
//   const products = await GroupsDS.getProductsByGroupID(groupId);
//   return c.json({ products });
// }

// export async function updateGroup(c: Context<EnvAPI>) {
//   const groupId = parseInt(c.req.param("group_id"), 10);
//   const group = await c.req.json();
//   const validation = NewGroupSchema.safeParse(group);
//   if (!validation.success) return c.json({ error: validation.error.issues[0].message }, 400);
//   const groupDB = await GroupsDS.getGroupById(groupId);
//   if (!groupDB) return c.json({ msg: "Group not found" }, 400);
//   await GroupsDS.updateGroup(groupId, validation.data);
//   return c.json({ msg: "Group updated successfully" });
// }

export async function activateGroup(c: Context<EnvAPI>) {
  const group_id = parseInt(c.req.param("group_id"), 10);
  const with_subgroups = c.req.query("with_subgroups");
  c.var.log.info(`Activating group ${group_id}, with_subgroups:${with_subgroups}`);
  await GroupsDS.activate(group_id);
  if (with_subgroups === "true") await SubgroupsDS.activateByGroupID(group_id);
  return c.json({ msg: "Group activated successfully" });
}

export async function deactivateGroup(c: Context<EnvAPI>) {
  const group_id = parseInt(c.req.param("group_id"), 10);
  const subgroups = await SubgroupsDS.getByParentGroupID(group_id);
  const subgroup_ids = subgroups.map((subgroup) => subgroup.subgroup_id);
  const products = await ProductsDS.getBySubgroupIDs(subgroup_ids, "active");
  if (products.length > 0) return c.json({ msg: "At least one of the subgroups has an active product" }, 400);
  await SubgroupsDS.deactivateMany(subgroup_ids);
  await GroupsDS.deactivate(group_id);
  return c.json({ msg: "Group and subgroups deactivated successfully" });
}

export async function deleteGroup(c: Context<EnvAPI>) {
  const group_id = parseInt(c.req.param("group_id"), 10);
  c.var.log.info(`Group to be deleted: ${group_id}`);
  await db.transaction(async (tx) => {
    //Delete dependencies
    const subgroups = await SubgroupsDS.getByParentGroupID(group_id);
    const subgroup_ids = subgroups.map((s) => s.subgroup_id);
    c.var.log.info(`Child subgroups: ${subgroup_ids.length}`);
    await SubgroupsDS.deleteMany(subgroup_ids, tx);
    c.var.log.info(`Child subgroups deleted`);
    await GroupsDS.delete(group_id, tx);
  });
  c.var.log.info(`Group deleted successfully`);
  return c.json(null, 204);
}

// export async function createGroup(c: Context<EnvAPI>) {
//   const newGroup: NewGroup = await c.req.json();
//   const validation = NewGroupSchema.safeParse(newGroup);
//   if (!validation.success) return c.json({ error: validation.error.issues[0].message }, 400);
//   await GroupsDS.createGroup(newGroup);
//   return c.json({ msg: "Group created successfully" }, 201);
// }

export async function getSubgroupById(c: Context<EnvAPI>) {
  const parentGroupId = parseInt(c.req.param("group_id"), 10);
  const subgroupID = parseInt(c.req.param("subgroup_id"), 10);
  if (isNaN(parentGroupId) || isNaN(subgroupID)) return c.json({ msg: "Invalid group IDs" }, 400);
  const subgroup = await GroupsDS.getSubgroupById(parentGroupId, subgroupID);
  if (!subgroup) return c.json({ msg: "Subgroup not found" }, 404);
  return c.json({ subgroup });
}

export async function getSubgroupsByParentGroupId(c: Context<EnvAPI>) {
  const parent_group_id = parseInt(c.req.param("group_id"), 10);
  if (isNaN(parent_group_id)) return c.json({ msg: "Invalid parent_group_id" }, 400);
  const subgroups = await SubgroupsDS.getByParentGroupID(parent_group_id);
  return c.json({ subgroups });
}

export async function getGroupById(c: Context<EnvAPI>) {
  const groupId = parseInt(c.req.param("group_id"), 10);
  if (isNaN(groupId)) return c.json({ msg: "Invalid group ID" }, 400);
  const group = await GroupsDS.getGroupById(groupId);
  if (!group) return c.json({ msg: "Group not found" }, 404);
  return c.json({ group });
}

/* --------------- Subgroups ----------------- */

// export async function getProductsBySubgroup(c: Context<EnvAPI>) {
//   const subgroupId = parseInt(c.req.param("subgroup_id"), 10);
//   const subgroup = await SubgroupsDS.getSubgroupById(subgroupId);
//   if (!subgroup) return c.json({ msg: "Group not found" }, 404);
//   const products = await SubgroupsDS.getProductsBySubgroupID(subgroupId);
//   return c.json({ products });
// }

export async function activateSubgroup(c: Context<EnvAPI>) {
  const subgroupId = parseInt(c.req.param("group_id"), 10);
  const subgroup = await SubgroupsDS.getSubgroupById(subgroupId);
  if (!subgroup) return c.json({ msg: "Group not found" }, 404);
  const parentGroup = await GroupsDS.getGroupById(subgroup?.parent_group_id);
  if (parentGroup && parentGroup.status === "inactive") return c.json({ msg: "Parent group is inactive" }, 400);
  await SubgroupsDS.activate(subgroupId);
  return c.json({ msg: "Subgroup activated successfully" });
}

export async function deactivateSubgroup(c: Context<EnvAPI>) {
  const subgroupId = parseInt(c.req.param("group_id"), 10);
  const result = await SubgroupsDS.deactivateSubgroup(subgroupId);
  if (!result) return c.json({ msg: "The subgroup has at least an active product" }, 404);
  return c.json({ msg: "Subgroup deactivated successfully" });
}

export async function createSubgroup(c: Context<EnvAPI>) {
  const parent_group_id = parseInt(c.req.param("group_id"), 10);
  const validator = NewSubGroupSchema.safeParse(await c.req.json());
  if (!validator.success)
    return c.json({ status: "error", msg: `${validator.error.errors[0].message} (${validator.error.errors[0].path.join(".")})` }, 400);

  const parent_group = await GroupsDS.getGroupById(parent_group_id);
  if (!parent_group) return c.json({ msg: "Parent Group not found" }, 400);
  await SubgroupsDS.createSubgroup({ ...validator.data, parent_group_id });
  return c.json({ msg: "Subgroup created successfully" }, 201);
}

export async function updateSubgroup(c: Context<EnvAPI>) {
  const parent_group_id = parseInt(c.req.param("group_id"), 10);
  const subgroupId = parseInt(c.req.param("subgroup_id"), 10);
  const subgroup = await c.req.json();

  const validation = NewSubGroupSchema.safeParse(subgroup);
  if (!validation.success) return c.json({ error: validation.error.issues[0].message }, 400);
  const subgroupDB = await SubgroupsDS.getSubgroupById(subgroupId);
  if (!subgroupDB) return c.json({ msg: "Group not found" }, 400);

  const parentGroup = await GroupsDS.getGroupById(parent_group_id);
  if (!parentGroup) return c.json({ msg: "Parent Group not found" }, 400);
  await SubgroupsDS.updateSubgroup(subgroupId, subgroup);
  return c.json({ msg: "Subgroup updated successfully" });
}

export async function deleteSubgroup(c: Context<EnvAPI>) {
  const subgroupId = parseInt(c.req.param("group_id"), 10);
  const subgroup = await SubgroupsDS.getSubgroupById(subgroupId);
  if (!subgroup) return c.json({ msg: "Subroup not found" }, 404);
  if (subgroup.status === "active") return c.json({ msg: "The Subgroups is active you can not delete it" }, 400);
  await SubgroupsDS.deleteSubgroup(subgroupId);
  return c.json(null, 204);
}
