import type { NewGroup, NewSubgroup } from "~/core/domain/groups/entity";
import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { GroupsDS, SubGroupDS } from "~/core/infrastructure/drizzle/groups";
import { NewGroupSchema } from "../domain/groups/validator/create-group-validator";
import { NewSubGroupSchema } from "../domain/groups/validator/create-subgroup-validator";

export async function getAll(c: Context<EnvAPI>) {
  const groups = await GroupsDS.getAllGroups();
  const subgroups = await SubGroupDS.getAllSubgroups();
  return c.json({ groups, subgroups });
}

/* --------------- Groups ----------------- */

export async function updateGroup(c: Context<EnvAPI>) {
  const groupId = parseInt(c.req.param("id"), 10);
  const group = await c.req.json();
  const validation = NewGroupSchema.safeParse(group);
  if (!validation.success) return c.json({ error: validation.error.issues[0].message }, 400);
  const groupDB = await GroupsDS.getGroupById(groupId);
  if (!groupDB) return c.json({ msg: "Group not found" }, 400);
  await GroupsDS.updateGroup(groupId, group);
  return c.json({ msg: "Group updated successfully" });
}

export async function activateGroup(c: Context<EnvAPI>) {
  const groupId = parseInt(c.req.param("id"), 10);
  const { activateSubgroups } = c.req.query();
  const group = await GroupsDS.getGroupById(groupId);
  if (!group) return c.json({ msg: "Group not found" }, 404);
  await GroupsDS.activateGroup(groupId);
  activateSubgroups == "true" && (await SubGroupDS.activateSubgroups(groupId));
  return c.json({ msg: "Group activated successfully" });
}

export async function deactivateGroup(c: Context<EnvAPI>) {
  const groupId = parseInt(c.req.param("id"), 10);
  const group = await GroupsDS.getGroupById(groupId);
  if (!group) return c.json({ msg: "Group not found" }, 404);
  const result = await GroupsDS.deactivateGroup(groupId);
  if (!result)
    return c.json({ msg: "At least one of the subgroups has an active product" }, 404);
  return c.json({ msg: "Group and subgroups deactivated successfully" });
}

export async function deleteGroup(c: Context<EnvAPI>) {
  const groupId = parseInt(c.req.param("id"), 10);
  const group = await GroupsDS.getGroupById(groupId);
  if (!group) return c.json({ msg: "Group not found" }, 404);
  await GroupsDS.deleteGroup(groupId);
  return c.json(null, 204);
}

export async function createGroup(c: Context<EnvAPI>) {
  const newGroup: NewGroup = await c.req.json();
  const validation = NewGroupSchema.safeParse(newGroup);
  if (!validation.success) return c.json({ error: validation.error.issues[0].message }, 400);
  await GroupsDS.createGroup(newGroup);
  return c.json({ msg: "Group created successfully" }, 201);
}

export async function getSubgroupById(c: Context<EnvAPI>) {
  const parentGroupId = parseInt(c.req.param("parent_group_id"), 10);
  const subgroupID = parseInt(c.req.param("subgroup_id"), 10);
  if (isNaN(parentGroupId) || isNaN(subgroupID)) return c.json({ msg: "Invalid group IDs" }, 400);
  const subgroup = await GroupsDS.getSubgroupById(parentGroupId, subgroupID);
  if (!subgroup) return c.json({ msg: "Subgroup not found" }, 404);
  return c.json({ subgroup });
}

export async function getSubgroupsByParentGroupId(c: Context<EnvAPI>) {
  const parentGroupId = parseInt(c.req.param("parent_group_id"), 10);
  if (isNaN(parentGroupId)) return c.json({ msg: "Invalid parent_group_id" }, 400);
  const subgroups = await GroupsDS.getSubgroupsByParentGroupId(parentGroupId);
  return c.json({ subgroups });
}

export async function getGroups(c: Context<EnvAPI>) {
  const groups = await GroupsDS.getAllGroups();
  return c.json({ groups });
}

export async function getGroupById(c: Context<EnvAPI>) {
  const groupId = parseInt(c.req.param("id"), 10);
  if (isNaN(groupId)) return c.json({ msg: "Invalid group ID" }, 400);
  const group = await GroupsDS.getGroupById(groupId);
  if (!group || group.length === 0) return c.json({ msg: "Group not found" }, 404);
  return c.json({ group: group[0] });
}

/* --------------- Subgroups ----------------- */

export async function activateSubgroup(c: Context<EnvAPI>) {
  const subgroupId = parseInt(c.req.param("id"), 10);
  const subgroup = await SubGroupDS.getSubgroupById(subgroupId);
  if (!subgroup) return c.json({ msg: "Group not found" }, 404);
  const parentGroup = await GroupsDS.getGroupById(subgroup?.parent_group_id);
  if (parentGroup[0].status === "inactive") return c.json({ msg: "Parent group is inactive" }, 400);
  await SubGroupDS.activateSubgroup(subgroupId);
  return c.json({ msg: "Subgroup activated successfully" });
}

export async function deactivateSubgroup(c: Context<EnvAPI>) {
  const subgroupId = parseInt(c.req.param("id"), 10);
  const result = await SubGroupDS.deactivateSubgroup(subgroupId);
  if (!result)
    return c.json({ msg: "The subgroup has at least an active product" }, 404);
  return c.json({ msg: "Subgroup deactivated successfully" });
}

export async function createSubgroup(c: Context<EnvAPI>) {
  const newGroup: NewSubgroup = await c.req.json();
  const validation = NewSubGroupSchema.safeParse(newGroup);
  if (!validation.success) return c.json({ error: validation.error.issues[0].message }, 400);
  const { parent_group_id } = validation.data;
  const parentGroup = await GroupsDS.getGroupById(parent_group_id);
  if (!parentGroup || parentGroup.length === 0) return c.json({ msg: "Parent Group not found" }, 400);
  const result = await SubGroupDS.createSubgroup(newGroup);
  if (!result[0].insertId)
  return c.json({ msg: "The subgroup already exists" }, 400);
  return c.json({ msg: "Subgroup created successfully" }, 201);
}

export async function updateSubgroup(c: Context<EnvAPI>) {
  const subgroupId = parseInt(c.req.param("id"), 10);
  const subgroup = await c.req.json();
  const validation = NewSubGroupSchema.safeParse(subgroup);
  if (!validation.success) return c.json({ error: validation.error.issues[0].message }, 400);
  const subgroupDB = await SubGroupDS.getSubgroupById(subgroupId);
  if (!subgroupDB) return c.json({ msg: "Group not found" }, 400);
  const { parent_group_id } = validation.data;
  const parentGroup = await GroupsDS.getGroupById(parent_group_id);
  if (!parentGroup) return c.json({ msg: "Parent Group not found" }, 400);
  await SubGroupDS.updateSubgroup(subgroupId, subgroup);
  return c.json({ msg: "Subgroup updated successfully" });
}

export async function deleteSubgroup(c: Context<EnvAPI>) {
  const subgroupId = parseInt(c.req.param("id"), 10);
  const subgroup = await SubGroupDS.getSubgroupById(subgroupId);
  if (!subgroup) return c.json({ msg: "Subroup not found" }, 404);
  if (subgroup.status === "active") return c.json({ msg: "The Subgroups is active you can not delete it" }, 400);
  await SubGroupDS.deleteSubgroup(subgroupId);
  return c.json(null, 204);
}
