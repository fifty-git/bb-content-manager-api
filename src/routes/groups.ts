import type { EnvAPI } from "~/core/domain/types";
import { Hono } from "hono";
import { GroupsService } from "~/core/application/groups/groups-service";
import {
  activateSubgroup,
  createSubgroup,
  deactivateSubgroup,
  deleteSubgroup,
  getGroupById,
  getSubgroupById,
  getSubgroupsByParentGroupId,
  updateSubgroup,
} from "~/core/application/groups-service";

export const groupsRouter = new Hono<EnvAPI>();

const group = new GroupsService();
// GET Requests
groupsRouter.get("/", group.GetAllDataAccess.run);
groupsRouter.get("/:group_id/subgroups/:subgroup_id", getSubgroupById);
groupsRouter.get("/:group_id/subgroups", getSubgroupsByParentGroupId);
groupsRouter.get("/:group_id", getGroupById);

// groupsRouter.get("/subgroups/all", getAll);
// groupsRouter.get("/products/:subgroup_id/subgroups", getProductsBySubgroup);
// groupsRouter.get("/products/:group_id", getProductsByGroup);

// POST Requests
groupsRouter.post("/", group.CreateUseCase.run);
groupsRouter.post("/:group_id/subgroups", createSubgroup);

// PUT Requests
groupsRouter.put("/:group_id", group.UpdateUseCase.run);
groupsRouter.put("/:group_id/activate", group.ActivateUseCase.run);
groupsRouter.put("/:group_id/deactivate", group.DeactivateUseCase.run);

groupsRouter.put("/:group_id/subgroups/:subgroup_id", updateSubgroup);
groupsRouter.put("/:group_id/subgroups/:subgroup_id/activate", activateSubgroup);
groupsRouter.put("/:group_id/subgroups/:subgroup_id/deactivate", deactivateSubgroup);

// DELETE Requests
groupsRouter.delete("/:group_id", group.DeleteUseCase.run);
groupsRouter.delete("/:group_id/subgroups", deleteSubgroup);
