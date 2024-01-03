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
groupsRouter.post("/subgroups", createSubgroup);

// GET Requests
groupsRouter.get("/:parent_group_id/subgroups/:subgroup_id", getSubgroupById);
groupsRouter.get("/:parent_group_id/subgroups", getSubgroupsByParentGroupId);
groupsRouter.get("/:id", getGroupById);
groupsRouter.get("", getAll);
// groupsRouter.get("/subgroups/all", getAll);
groupsRouter.get("/products/:subgroup_id/subgroups", getProductsBySubgroup);
groupsRouter.get("/products/:group_id", getProductsByGroup);
