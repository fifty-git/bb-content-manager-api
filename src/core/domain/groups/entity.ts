export interface Group {
  group_id: number;
  name: string;
}
export interface NewGroup {
  name: string;
  parent_group_id?: number;
}
export interface UpdateGroup {
  group_id: number;
  name: string;
}
export interface Subgroup {
  subgroup_id: number;
  name: string;
  status: string;
  product_references?: number;
}
export interface NewSubgroup {
  name: string;
  parent_group_id: number;
}
export interface UpdateSubgroup {
  name: string;
  parent_group_id: number;
}
