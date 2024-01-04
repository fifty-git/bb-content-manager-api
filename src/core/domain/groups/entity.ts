export interface GroupEntity {
  group_id: number;
  name: string;
  parent_group_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface NewGroup {
  name: string;
  parent_group_id?: number;
}

export interface UpdateGroup {
  name: string;
  parent_group_id?: number;
}

export interface Group {
  group_id: number;
  name: string;
}

export interface NewSubgroup {
  name: string;
  parent_group_id: number;
}

export interface Subgroup {
  subgroup_id: number;
  name: string;
  status: string;
  product_references?: number;
}

export interface UpdateSubgroup {
  name: string;
  parent_group_id: number;
}
