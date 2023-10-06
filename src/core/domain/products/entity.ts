export interface NewProduct {
  name: string;
  is_standalone: boolean;
  product_type: "single" | "bundle";
}
