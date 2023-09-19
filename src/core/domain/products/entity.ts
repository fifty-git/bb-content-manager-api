export interface NewProduct {
  name: string;
  group_id?: number;
  subgroup_id?: number;
}

export interface CreateProductsAPI {
  product_type: string;
  products: NewProduct[];
}
