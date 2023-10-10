export interface NewProduct {
  sales_channel_id: number;
  name: string;
  is_standalone: boolean;
  product_type: "single" | "bundle";
}
