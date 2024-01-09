import type { Subgroup } from "~/core/domain/subgroups/types";
import { BaseDataAccess } from "~/core/application/use-cases/base";
import { SubgroupsDS } from "~/core/infrastructure/drizzle/subgroups";

export class GetAllDataAccess extends BaseDataAccess {
  protected status_code = 200;
  protected msg? = undefined;
  protected data = undefined;
  protected response?: Subgroup[];

  protected async validateData() {}

  protected async process() {
    this.response = await SubgroupsDS.getAll();
  }
}
