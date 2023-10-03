export interface NewVariantOption {
  variant_id: number;
  dropdown_name: string;
  creates_po: number;
  display_order: number;
}

export interface NewVariantOV {
  variant_option_id: number;
  product_id: null | number;
  value: string;
  additional_price: string;
  sku: string;
  is_default: number;
  display_order: number;
}
