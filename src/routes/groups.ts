import { Hono } from "hono";
import {
  activateGroup,
  activateSubgroup,
  createGroup,
  createSubGroup,
  deactivateGroup,
  deactivateSubgroup,
  deleteGroup,
  deleteSubgroup,
  getAll,
  getGroupById,
  getGroups,
  getSubgroupById,
  getSubgroupsByParentGroupId,
  updateGroup,
  updateSubgroup,
} from "~/core/application/groups-service";

export const groupsRouter = new Hono();

// PUT Requests
groupsRouter.put("/:id/deactivate", deactivateGroup);
groupsRouter.put("/:id/deactivate/subgroups", deactivateSubgroup);
groupsRouter.put("/:id/activate", activateGroup);
groupsRouter.put("/:id/activate/subgroups", activateSubgroup);
groupsRouter.put("/:id", updateGroup);
groupsRouter.put("/:id/subgroups", updateSubgroup);

// DELETE Requests
groupsRouter.delete("/:id", deleteGroup);
groupsRouter.delete("/:id/subgroups", deleteSubgroup);

// POST Requests
groupsRouter.post("", createGroup);
groupsRouter.post("/subgroups", createSubGroup);

// GET Requests
groupsRouter.get("/:parent_group_id/subgroups/:subgroup_id", getSubgroupById);
groupsRouter.get("/:parent_group_id/subgroups", getSubgroupsByParentGroupId);
groupsRouter.get("/:id", getGroupById);
groupsRouter.get("", getGroups);
groupsRouter.get("/subgroups/all", getAll);
