import type { GetGroupByID, Group } from "~/core/domain/groups/types";
import type { Subgroup } from "~/core/domain/subgroups/types";
import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { BaseDataAccess } from "~/core/application/use-cases/base";
import { GroupsDS } from "~/core/infrastructure/drizzle/groups";
import { ProductsDS } from "~/core/infrastructure/drizzle/products";
import { SubgroupsDS } from "~/core/infrastructure/drizzle/subgroups";

async function addReferencesToSubgroups(subgroups: Subgroup[]) {
  return Promise.all(
    subgroups.map(async (subgroup) => {
      const refs = await ProductsDS.getBySubgroupID(subgroup.subgroup_id);
      return { ...subgroup, product_references: refs.length };
    }),
  );
}

async function addSubgroupsToGroups(groups: Group[]) {
  return Promise.all(
    groups.map(async (group) => {
      const _subgroups = await SubgroupsDS.getByParentGroupID(group.group_id);
      const subgroups = await addReferencesToSubgroups(_subgroups);
      return { ...group, subgroups };
    }),
  );
}

export class GetAllDataAccess extends BaseDataAccess {
  protected status_code = 200;
  protected msg? = undefined;
  protected data = undefined;
  protected response: Group[] | undefined = undefined;

  protected async validateData() {}

  protected async process() {
    const _groups = await GroupsDS.getAll();
    this.response = await addSubgroupsToGroups(_groups);
  }
}

export class GetByIDDataAccess extends BaseDataAccess {
  protected status_code = 200;
  protected msg? = undefined;
  protected data: { group_id: number } | undefined = undefined;
  protected response: GetGroupByID | undefined = undefined;

  protected async validateData(c: Context<EnvAPI>) {
    const group_id = parseInt(c.req.param("group_id"), 10);
    this.data = { group_id };
  }

  protected async process() {
    if (this.data) {
      const _group = await GroupsDS.getByGroupID(this.data.group_id);
      const subgroups = await GroupsDS.getSubgroupsByGroupID(this.data.group_id);
      const products = await ProductsDS.getByGroupID(this.data.group_id);
      if (_group) this.response = { group: { ..._group }, subgroups, products };
      else this.response = { group: undefined, subgroups: [], products: [] };
    }
  }
}
