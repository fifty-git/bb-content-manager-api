import type { EnvAPI } from "~/core/domain/types";
import { Hono } from "hono";
import { SubgroupsService } from "~/core/application/subgroups/subgroups-service";

export const subgroupsRouter = new Hono<EnvAPI>();

const subgroup = new SubgroupsService();

// GET Requests
subgroupsRouter.get("/", subgroup.GetAllDataAccess.run);
