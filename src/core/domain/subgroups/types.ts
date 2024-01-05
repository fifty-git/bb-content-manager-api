export interface Subgroup {
  subgroup_id: number;
  name: string;
  status: string;
  product_references?: number;
}
export interface CreateSubgroup {
  name: string;
  parent_group_id: number;
}
export interface UpdateSubgroup {
  subgroup_id: number;
  name: string;
  parent_group_id: number;
  new_parent_group_id: number;
}
export interface ActivateSubgroup {
  subgroup_id: number;
}
export interface DeactivateSubgroup {
  subgroup_id: number;
}
export interface DeleteSubgroup {
  subgroup_id: number;
}