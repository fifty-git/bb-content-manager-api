export interface Variant {
  variant_id: number;
  name: string;
  units: number;
  measure_units: string;
  price: string;
  upc: string;
}

export interface NewVariant {
  product_id: number;
  name: string;
  units: number;
  measure_units: string;
  price: string;
  upc: string;
  display_order: number;
}