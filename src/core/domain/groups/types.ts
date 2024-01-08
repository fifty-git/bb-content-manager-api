import type { Subgroup } from "~/core/domain/subgroups/types";

interface Product {
  product_id: number;
  name: string;
  status: string;
}

export interface Group {
  group_id: number;
  name: string;
  subgroups?: Subgroup[];
}
export interface GetGroupByID {
  group_id?: number;
  name?: string;
  subgroups: Subgroup[];
  products: Product[];
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
