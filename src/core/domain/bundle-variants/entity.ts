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
  upc: string;
  display_order: number;
}
