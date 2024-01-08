import type { EnvAPI } from "~/core/domain/types";
import { Hono } from "hono";
import { GroupsService } from "~/core/application/groups/groups-service";
import { getSubgroupById, getSubgroupsByParentGroupId } from "~/core/application/groups-service";
import { SubgroupsService } from "~/core/application/subgroups/subgroups-service";

export const groupsRouter = new Hono<EnvAPI>();

const group = new GroupsService();
const subgroup = new SubgroupsService();
// GET Requests
groupsRouter.get("/", group.GetAllDataAccess.run);
groupsRouter.get("/:group_id/subgroups/:subgroup_id", getSubgroupById);
groupsRouter.get("/:group_id/subgroups", getSubgroupsByParentGroupId);
groupsRouter.get("/:group_id", group.GetByIDDataAccess.run);

// groupsRouter.get("/subgroups/all", getAll);
// groupsRouter.get("/products/:subgroup_id/subgroups", getProductsBySubgroup);
// groupsRouter.get("/products/:group_id", getProductsByGroup);

// POST Requests
groupsRouter.post("/", group.CreateUseCase.run);
groupsRouter.post("/:group_id/subgroups", subgroup.CreateUseCase.run);

// PUT Requests
groupsRouter.put("/:group_id", group.UpdateUseCase.run);
groupsRouter.put("/:group_id/activate", group.ActivateUseCase.run);
groupsRouter.put("/:group_id/deactivate", group.DeactivateUseCase.run);

groupsRouter.put("/:group_id/subgroups/:subgroup_id", subgroup.UpdateUseCase.run);
groupsRouter.put("/:group_id/subgroups/:subgroup_id/activate", subgroup.ActivateUseCase.run);
groupsRouter.put("/:group_id/subgroups/:subgroup_id/deactivate", subgroup.DeactivateUseCase.run);

// DELETE Requests
groupsRouter.delete("/:group_id", group.DeleteUseCase.run);
groupsRouter.delete("/:group_id/subgroups/:subgroup_id", subgroup.DeleteUseCase.run);
