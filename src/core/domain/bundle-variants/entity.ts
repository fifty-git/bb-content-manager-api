export interface BundleVariant {
  bundle_variant_id: number;
  name: string;
  price: string;
  upc: string;
}

export interface NewBundleVariant {
  bundle_id: number;
  name: string;
  price: string;
  units: number;
  measure_units: string;
  upc: string;
  display_order: number;
}
