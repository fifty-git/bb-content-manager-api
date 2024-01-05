import type { CreateGroup } from "~/core/domain/groups/types";
import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { z } from "zod";
import { BaseUseCase } from "~/core/application/use-cases/base";
import { GroupsDS } from "~/core/infrastructure/drizzle/groups";

export const schema = z.object({
  name: z
    .string({ required_error: "Group name is required", invalid_type_error: "Group name must be a string" })
    .min(1, { message: "Group name must be at minimun of 1 char." })
    .max(50, { message: "Group name must be at maximum of 50 chars" }),
});

export class CreateUseCase extends BaseUseCase {
  protected status_code = 200;
  protected msg = "Group created successfully";
  private data: CreateGroup | undefined = undefined;

  protected async validateData(c: Context<EnvAPI>) {
    const data = await c.req.json();
    const validator = schema.safeParse(data);
    if (!validator.success) return validator.error.issues[0].message;
    this.data = validator.data;
  }

  protected async process() {
    if (this.data) await GroupsDS.createGroup(this.data);
  }
}
