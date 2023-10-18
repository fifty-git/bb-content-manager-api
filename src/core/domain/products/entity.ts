export interface NewProduct {
  sales_channel_id: number;
  name: string;
  is_standalone?: boolean;
  product_type: "single" | "bundle";
}

export interface ClonedProduct {
  product_id?: number;
  sales_channel_id: number;
  name: string;
  description?: string;
  is_standalone?: boolean;
  product_type: "single" | "bundle";
  status?: "inactive" | "draft" | "active";
  created_at?: string;
  updated_at?: string;
}
