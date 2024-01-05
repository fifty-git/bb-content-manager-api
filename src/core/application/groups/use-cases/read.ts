import type { Group, Subgroup } from "~/core/domain/groups/types";
import { BaseDataAccess } from "~/core/application/use-cases/base";
import { GroupsDS } from "~/core/infrastructure/drizzle/groups";
import { SubgroupsDS } from "~/core/infrastructure/drizzle/subgroups";

async function addReferencesToSubgroups(subgroups: Subgroup[]) {
  return Promise.all(
    subgroups.map(async (subgroup) => {
      const refs = await SubgroupsDS.getProductsBySubgroupID(subgroup.subgroup_id);
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
  protected data: Group[] | undefined = undefined;

  protected async validateData() {}

  protected async process() {
    const _groups = await GroupsDS.getAll();
    this.data = await addSubgroupsToGroups(_groups);
  }
}
