import { Hono } from "hono";
import {
  createGroup,
  deactivateGroup,
  deleteGroup,
  getGroupById,
  getGroups,
  getSubgroupById,
  getSubgroupsByParentGroupId,
  updateGroup,
} from "~/core/application/groups-service";

export const groupsRouter = new Hono();

// PUT Requests
groupsRouter.put("/:id/deactivate", deactivateGroup);
groupsRouter.put("/:id", updateGroup);

// DELETE Requests
groupsRouter.delete("/:id", deleteGroup);

// POST Requests
groupsRouter.post("", createGroup);

// GET Requests
groupsRouter.get("/:parent_group_id/subgroups/:id", getSubgroupById);
groupsRouter.get("/:parent_group_id/subgroups", getSubgroupsByParentGroupId);
groupsRouter.get("/:id", getGroupById);
groupsRouter.get("", getGroups);
