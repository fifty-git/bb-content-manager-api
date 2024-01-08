import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { GroupsDS } from "~/core/infrastructure/drizzle/groups";
import { SubgroupsDS } from "~/core/infrastructure/drizzle/subgroups";

export async function getSubgroupById(c: Context<EnvAPI>) {
  const parentGroupId = parseInt(c.req.param("group_id"), 10);
  const subgroupID = parseInt(c.req.param("subgroup_id"), 10);
  if (isNaN(parentGroupId) || isNaN(subgroupID)) return c.json({ msg: "Invalid group IDs" }, 400);
  const subgroup = await GroupsDS.getSubgroupByGroupID(parentGroupId, subgroupID);
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
  const group = await GroupsDS.getByGroupID(groupId);
  if (!group) return c.json({ msg: "Group not found" }, 404);
  return c.json({ group });
}

/* --------------- Subgroups ----------------- */

// export async function getProductsBySubgroup(c: Context<EnvAPI>) {
//   const subgroupId = parseInt(c.req.param("subgroup_id"), 10);
//   const subgroup = await SubgroupsDS.getByProductID(subgroupId);
//   if (!subgroup) return c.json({ msg: "Group not found" }, 404);
//   const products = await SubgroupsDS.getProductsBySubgroupID(subgroupId);
//   return c.json({ products });
// }

// export async function activateSubgroup(c: Context<EnvAPI>) {
//   const subgroupId = parseInt(c.req.param("group_id"), 10);
//   const subgroup = await SubgroupsDS.getByProductID(subgroupId);
//   if (!subgroup) return c.json({ msg: "Group not found" }, 404);
//   const parentGroup = await GroupsDS.getByProductID(subgroup?.parent_group_id);
//   if (parentGroup && parentGroup.status === "inactive") return c.json({ msg: "Parent group is inactive" }, 400);
//   await SubgroupsDS.activate(subgroupId);
//   return c.json({ msg: "Subgroup activated successfully" });
// }

// export async function deactivateSubgroup(c: Context<EnvAPI>) {
//   const subgroupId = parseInt(c.req.param("group_id"), 10);
//   const result = await SubgroupsDS.deactivateSubgroup(subgroupId);
//   if (!result) return c.json({ msg: "The subgroup has at least an active product" }, 404);
//   return c.json({ msg: "Subgroup deactivated successfully" });
// }

// export async function createSubgroup(c: Context<EnvAPI>) {
//   const parent_group_id = parseInt(c.req.param("group_id"), 10);
//   const validator = NewSubGroupSchema.safeParse(await c.req.json());
//   if (!validator.success)
//     return c.json({ status: "error", msg: `${validator.error.errors[0].message} (${validator.error.errors[0].path.join(".")})` }, 400);
//
//   const parent_group = await GroupsDS.getByProductID(parent_group_id);
//   if (!parent_group) return c.json({ msg: "Parent Group not found" }, 400);
//   await SubgroupsDS.createSubgroup({ ...validator.data, parent_group_id });
//   return c.json({ msg: "Subgroup created successfully" }, 201);
// }

// export async function updateSubgroup(c: Context<EnvAPI>) {
//   const parent_group_id = parseInt(c.req.param("group_id"), 10);
//   const subgroupId = parseInt(c.req.param("subgroup_id"), 10);
//   const subgroup = await c.req.json();
//
//   const validation = NewSubGroupSchema.safeParse(subgroup);
//   if (!validation.success) return c.json({ error: validation.error.issues[0].message }, 400);
//   const subgroupDB = await SubgroupsDS.getByProductID(subgroupId);
//   if (!subgroupDB) return c.json({ msg: "Group not found" }, 400);
//
//   const parentGroup = await GroupsDS.getByProductID(parent_group_id);
//   if (!parentGroup) return c.json({ msg: "Parent Group not found" }, 400);
//   await SubgroupsDS.updateSubgroup(subgroupId, subgroup);
//   return c.json({ msg: "Subgroup updated successfully" });
// }

// export async function deleteSubgroup(c: Context<EnvAPI>) {
//   const subgroupId = parseInt(c.req.param("group_id"), 10);
//   const subgroup = await SubgroupsDS.getByProductID(subgroupId);
//   if (!subgroup) return c.json({ msg: "Subroup not found" }, 404);
//   if (subgroup.status === "active") return c.json({ msg: "The Subgroups is active you can not delete it" }, 400);
//   await SubgroupsDS.deleteSubgroup(subgroupId);
//   return c.json(null, 204);
// }
