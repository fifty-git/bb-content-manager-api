export interface NewBundleVariantOption {
  bundle_variant_id: number;
  dropdown_name: string;
  creates_po: boolean;
  display_order: number;
}

export interface NewBundleVariantOV {
  bvo_id: number;
  product_id: null | number;
  value: string;
  additional_price: string;
  sku: string;
  is_default: boolean;
  display_order: number;
}
