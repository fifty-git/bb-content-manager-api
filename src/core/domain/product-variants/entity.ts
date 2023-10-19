export interface Variant {
  variant_id: number;
  product_id: number;
  name: string;
  price: string;
  units: number;
  measure_units: string;
  upc: string;
  creates_po: boolean;
  is_default: boolean;
  display_order: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ClonedVariant {
  variant_id?: number;
  product_id: number;
  name: string;
  price: string;
  units: number;
  measure_units: string;
  upc: string;
  creates_po: boolean;
  is_default: boolean;
  display_order: number;
  status: string;
  created_at: string;
  updated_at: string;
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
