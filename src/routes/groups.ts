import { Hono } from "hono";
import {
  activateGroup,
  activateSubgroup,
  createGroup,
  createSubgroup,
  deactivateGroup,
  deactivateSubgroup,
  deleteGroup,
  deleteSubgroup,
  getAll,
  getGroupById,
  getProductsByGroup,
  getProductsBySubgroup,
  getSubgroupById,
  getSubgroupsByParentGroupId,
  updateGroup,
  updateSubgroup,
} from "~/core/application/groups-service";

export const groupsRouter = new Hono();

// GET Requests
groupsRouter.get("/", getAll);
groupsRouter.get("/:group_id/subgroups/:subgroup_id", getSubgroupById);
groupsRouter.get("/:group_id/subgroups", getSubgroupsByParentGroupId);
groupsRouter.get("/:group_id", getGroupById);

// groupsRouter.get("/subgroups/all", getAll);
// groupsRouter.get("/products/:subgroup_id/subgroups", getProductsBySubgroup);
// groupsRouter.get("/products/:group_id", getProductsByGroup);

// POST Requests
groupsRouter.post("/", createGroup);
groupsRouter.post("/:group_id/subgroups", createSubgroup);

// PUT Requests
groupsRouter.put("/:group_id/deactivate", deactivateGroup);
groupsRouter.put("/:group_id/deactivate/subgroups", deactivateSubgroup);
groupsRouter.put("/:group_id/activate", activateGroup);
groupsRouter.put("/:group_id/activate/subgroups", activateSubgroup);
groupsRouter.put("/:group_id", updateGroup);
groupsRouter.put("/:group_id/subgroups", updateSubgroup);

// DELETE Requests
groupsRouter.delete("/:group_id", deleteGroup);
groupsRouter.delete("/:group_id/subgroups", deleteSubgroup);
