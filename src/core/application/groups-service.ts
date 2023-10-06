import type { NewGroup } from "~/core/domain/groups/entity";
import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { GroupsDS } from "~/core/infrastructure/drizzle/groups";
import { NewGroupSchema } from "../domain/groups/validator/create-group-validator";

export async function updateGroup(c: Context<EnvAPI>) {
  const groupId = parseInt(c.req.param("id"), 10);
  const group = await c.req.json();
  const validation = NewGroupSchema.safeParse(group);
  if (!validation.success) return c.json({ error: validation.error.issues[0].message }, 400);
  const groupDB = await GroupsDS.getGroupById(groupId);
  if (!groupDB) return c.json({ msg: "Group not found" }, 400);
  const { parent_group_id } = validation.data;
  if (parent_group_id) {
    const parentGroup = await GroupsDS.getGroupById(parent_group_id);
    const subGroups = await GroupsDS.getSubgroupsByParentGroupId(groupId);
    if (!parentGroup) return c.json({ msg: "Parent Group not found" }, 400);
    if (parentGroup[0].parent_group_id) return c.json({ msg: "The Parent Group already has a parent group" }, 400);
    if (subGroups.length) return c.json({ msg: "The Group is already a parent group" }, 400);
  }
  await GroupsDS.updateGroup(groupId, group);
  return c.json({ msg: "Group updated successfully" });
}

export async function deactivateGroup(c: Context<EnvAPI>) {
  const groupId = parseInt(c.req.param("id"), 10);
  const group = await GroupsDS.getGroupById(groupId);
  if (!group) return c.json({ msg: "Group not found" }, 404);
  await GroupsDS.deactivateGroup(groupId);
  return c.json({ msg: "Group deactivated successfully" });
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
  const { parent_group_id } = validation.data;
  if (parent_group_id) {
    const parentGroup = await GroupsDS.getGroupById(parent_group_id);
    if (!parentGroup || parentGroup.length === 0) return c.json({ msg: "Parent Group not found" }, 400);
    if (parentGroup[0].parent_group_id) return c.json({ msg: "The Parent Group already has a parent group" }, 400);
  }
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
  const groups = await GroupsDS.getAll();
  return c.json({ groups });
}

export async function getGroupById(c: Context<EnvAPI>) {
  const groupId = parseInt(c.req.param("id"), 10);
  if (isNaN(groupId)) return c.json({ msg: "Invalid group ID" }, 400);
  const group = await GroupsDS.getGroupById(groupId);
  if (!group || group.length === 0) return c.json({ msg: "Group not found" }, 404);
  return c.json({ group: group[0] });
}
