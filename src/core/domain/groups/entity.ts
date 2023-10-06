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

export interface Subgroup {
  group_id: number;
  name: string;
  parent_group_id: number;
}
