export interface Group {
  group_id: number;
  name: string;
}

export interface Subgroup {
  group_id: number;
  name: string;
  parent_group_id: number;
}
