import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { BaseUseCase } from "~/core/application/use-cases/base";
import { GroupsDS } from "~/core/infrastructure/drizzle/groups";
import { ProductsDS } from "~/core/infrastructure/drizzle/products";
import { SubgroupsDS } from "~/core/infrastructure/drizzle/subgroups";
import { db } from "~/modules/drizzle";

import {ActivateGroup, DeactivateGroup, DeleteGroup} from "~/core/domain/groups/types";

export class ActivateUseCase extends BaseUseCase {
  protected status_code = 200;
  protected msg = "Group activated successfully";
  private data: ActivateGroup | undefined = undefined;

  protected async validateData(c: Context<EnvAPI>) {
    const group_id = parseInt(c.req.param("group_id"), 10);
    const with_subgroups = c.req.query("with_subgroups") === "true";
    this.data = { group_id, with_subgroups };
  }

  protected async process() {
    if (this.data) {
      await GroupsDS.activate(this.data.group_id);
      if (this.data.with_subgroups) await SubgroupsDS.activateByGroupID(this.data.group_id);
    }
  }
}

export class DeactivateUseCase extends BaseUseCase {
  protected status_code = 200;
  protected msg = "Group deactivated successfully";
  private data: DeactivateGroup | undefined = undefined;

  protected async validateData(c: Context<EnvAPI>) {
    const group_id = parseInt(c.req.param("group_id"), 10);
    const subgroups = await SubgroupsDS.getByParentGroupID(group_id);
    const subgroup_ids = subgroups.map((subgroup) => subgroup.subgroup_id);
    const products = await ProductsDS.getBySubgroupIDs(subgroup_ids, "active");
    if (products.length > 0) return c.json({ msg: "At least one of the subgroups has an active product" }, 400);
    this.data = { group_id, subgroup_ids };
  }

  protected async process() {
    if (this.data) {
      await SubgroupsDS.deactivateMany(this.data.subgroup_ids);
      await GroupsDS.deactivate(this.data.group_id);
    }
  }
}

export class DeleteUseCase extends BaseUseCase {
  protected status_code = 204;
  protected msg = "";
  private data: DeleteGroup | undefined = undefined;

  protected async validateData(c: Context<EnvAPI>) {
    const group_id = parseInt(c.req.param("group_id"), 10);
    this.data = { group_id };
  }

  protected async process() {
    const self = this;
    await db.transaction(async (tx) => {
      if (self.data) {
        //Delete dependencies
        const subgroups = await SubgroupsDS.getByParentGroupID(self.data.group_id);
        const subgroup_ids = subgroups.map((s) => s.subgroup_id);
        await SubgroupsDS.deleteMany(subgroup_ids, tx);
        await GroupsDS.delete(self.data.group_id, tx);
      }
    });
  }
}
