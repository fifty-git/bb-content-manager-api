export interface NewVariantOption {
  variant_id: number;
  dropdown_name: string;
  creates_po: boolean;
  display_order: number;
}

export interface ClonedVariantOption {
  variant_option_id?: number;
  variant_id: number;
  dropdown_name: string;
  creates_po: boolean;
  display_order: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ClonedVariantOV {
  variant_option_value_id?: number;
  variant_option_id: number;
  product_id: null | number;
  value: string;
  additional_price: string;
  is_default: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface NewVariantOV {
  variant_option_id: number;
  product_id: null | number;
  value: string;
  additional_price: string;
  is_default: boolean;
  display_order: number;
}
