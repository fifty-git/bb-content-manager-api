import type { UpdateSubgroup } from "~/core/domain/subgroups/types";
import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { z } from "zod";
import { BaseUseCase } from "~/core/application/use-cases/base";
import { GroupsDS } from "~/core/infrastructure/drizzle/groups";
import { SubgroupsDS } from "~/core/infrastructure/drizzle/subgroups";

export const schema = z.object({
  parent_group_id: z.number().min(1),
  new_parent_group_id: z.number().min(1),
  subgroup_id: z.number().min(1),
  name: z
    .string({ required_error: "Group name is required", invalid_type_error: "Group name must be a string" })
    .min(1, { message: "Group name must be at minimun of 1 char." })
    .max(50, { message: "Group name must be at maximum of 50 chars" }),
});

export class UpdateUseCase extends BaseUseCase {
  protected status_code = 201;
  protected msg = "Group updated successfully";
  private data: UpdateSubgroup | undefined = undefined;

  protected async validateData(c: Context<EnvAPI>) {
    const parent_group_id = parseInt(c.req.param("group_id"), 10);
    const subgroup_id = parseInt(c.req.param("subgroup_id"), 10);
    const data = await c.req.json();

    const validator = schema.safeParse({ ...data, parent_group_id, subgroup_id });
    if (!validator.success) return validator.error.issues[0].message;
    const parent_group = await GroupsDS.getByID(validator.data.parent_group_id);
    if (!parent_group) return c.json({ msg: "Parent Group not found" }, 400);
    const new_parent_group = await GroupsDS.getByID(validator.data.new_parent_group_id);
    if (!new_parent_group) return c.json({ msg: "New Parent Group not found" }, 400);
    this.data = validator.data;
  }

  protected async process() {
    if (this.data)
      await SubgroupsDS.updateSubgroup(this.data.subgroup_id, this.data.name, this.data.parent_group_id, this.data.new_parent_group_id);
  }
}