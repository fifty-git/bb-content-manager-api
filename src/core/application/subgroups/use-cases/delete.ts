import type { ActivateSubgroup, DeactivateSubgroup, DeleteSubgroup } from "~/core/domain/subgroups/types";
import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { BaseUseCase } from "~/core/application/use-cases/base";
import { GroupsDS } from "~/core/infrastructure/drizzle/groups";
import { ProductsDS } from "~/core/infrastructure/drizzle/products";
import { SubgroupsDS } from "~/core/infrastructure/drizzle/subgroups";

export class ActivateUseCase extends BaseUseCase {
  protected status_code = 200;
  protected msg = "Subgroup activated successfully";
  private data: ActivateSubgroup | undefined = undefined;

  protected async validateData(c: Context<EnvAPI>) {
    const parent_group_id = parseInt(c.req.param("group_id"), 10);
    const subgroup_id = parseInt(c.req.param("subgroup_id"), 10);

    const subgroup = await SubgroupsDS.getByID(subgroup_id);
    if (!subgroup) return c.json({ msg: "Subgroup not found" }, 404);
    const parent_group = await GroupsDS.getByID(parent_group_id);
    if (parent_group && parent_group.status === "inactive") return c.json({ msg: "Parent group is inactive" }, 400);
    this.data = { subgroup_id };
  }

  protected async process() {
    if (this.data) {
      await SubgroupsDS.activate(this.data.subgroup_id);
    }
  }
}

export class DeactivateUseCase extends BaseUseCase {
  protected status_code = 200;
  protected msg = "Subgroup deactivated successfully";
  private data: DeactivateSubgroup | undefined = undefined;

  protected async validateData(c: Context<EnvAPI>) {
    const subgroup_id = parseInt(c.req.param("subgroup_id"), 10);

    const products = await ProductsDS.getBySubgroupID(subgroup_id, "active");
    if (products.length > 0) return "The subgroup has at least an active product";
    this.data = { subgroup_id };
  }

  protected async process() {
    if (this.data) {
      await SubgroupsDS.deactivate(this.data.subgroup_id);
    }
  }
}

export class DeleteUseCase extends BaseUseCase {
  protected status_code = 204;
  protected msg = "";
  private data: DeleteSubgroup | undefined = undefined;

  protected async validateData(c: Context<EnvAPI>) {
    const subgroup_id = parseInt(c.req.param("subgroup_id"), 10);
    const subgroup = await SubgroupsDS.getByID(subgroup_id);
    if (!subgroup) return "Subgroup not found";
    if (subgroup.status === "active") return "The Subgroups is active you can not delete it";
    this.data = { subgroup_id };
  }

  protected async process() {
    if (this.data) {
      await SubgroupsDS.deleteSubgroup(this.data.subgroup_id);
    }
  }
}
