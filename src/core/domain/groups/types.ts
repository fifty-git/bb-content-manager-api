import type { Subgroup } from "~/core/domain/subgroups/types";

export interface ProductGroup {
  product_id: number;
  subgroup_id: number;
  name: string;
  status: string;
  product_type: string;
}

export interface Group {
  group_id: number;
  name: string;
  subgroups?: Subgroup[];
}
export interface CreateGroup {
  name: string;
  parent_group_id?: number;
}
export interface UpdateGroup {
  group_id: number;
  name: string;
}
export interface ActivateGroup {
  group_id: number;
  with_subgroups: boolean;
}
export interface DeactivateGroup {
  group_id: number;
  subgroup_ids: number[];
}
export interface DeleteGroup {
  group_id: number;
}
