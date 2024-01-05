import type { UpdateGroup } from "~/core/domain/groups/types";
import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { z } from "zod";
import { BaseUseCase } from "~/core/application/use-cases/base";
import { GroupsDS } from "~/core/infrastructure/drizzle/groups";

export const schema = z.object({
  group_id: z.number().min(1),
  name: z
    .string({ required_error: "Group name is required", invalid_type_error: "Group name must be a string" })
    .min(1, { message: "Group name must be at minimun of 1 char." })
    .max(50, { message: "Group name must be at maximum of 50 chars" }),
});

export class UpdateUseCase extends BaseUseCase {
  protected status_code = 201;
  protected msg = "Group updated successfully";
  private data: UpdateGroup | undefined = undefined;

  protected async validateData(c: Context<EnvAPI>) {
    const group_id = parseInt(c.req.param("group_id"), 10);
    const data = await c.req.json();
    const validator = schema.safeParse({ ...data, group_id });
    if (!validator.success) return validator.error.issues[0].message;
    const groupDB = await GroupsDS.getGroupById(validator.data.group_id);
    if (!groupDB) return "Group not found";
    this.data = validator.data;
  }

  protected async process() {
    if (this.data) await GroupsDS.updateGroup(this.data.group_id, this.data.name);
  }
}
