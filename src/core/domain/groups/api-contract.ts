interface Subgroup {
  subgroup_id: number;
  name: string;
  status: string;
}

interface Product {
  product_id: number;
  subgroup: Subgroup;
  name: string;
  status: string;
  product_type: string;
}

interface Group {
  group_id: number;
  name: string;
  status: string;
  subgroups: Subgroup[];
}

export interface GetAllGroups {
  groups: Group[];
}

export interface GetProductsGroup {
  products: Product[];
}
