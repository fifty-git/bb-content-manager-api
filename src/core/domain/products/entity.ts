export interface NewProduct {
  product_name: string;
  group_id?: number;
  subgroup_id?: number;
  product_type: string;
}

export interface CreateProductsAPI {
  products: NewProduct[];
}
