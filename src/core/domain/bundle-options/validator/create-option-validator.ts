import { z } from "zod";
import { PRICE_REGEX } from "~/core/domain/constants";

const OptionSchema = z.object({
  product_id: z.union([z.null(), z.number().min(1, "Product ID referenced by selectable option is invalid")]),
  value: z.string().nonempty("Option value name is required and cannot be empty"),
  additional_price: z
    .string()
    .refine((price) => PRICE_REGEX.test(price), "Invalid price format. Price should have up to two decimal places and no currency symbols.")
    .refine((price) => parseFloat(price) >= 0, {
      message: "Additional price should be 0.00 or more.",
    }),
  sku: z.string(),
  is_default: z.boolean(),
});

export const CreateBundleOptionsAPISchema = z.object({
  bundle_id: z.number().min(1, "Bundle Product ID is invalid"),
  bundle_variant_id: z.number().min(1, "Variant ID is invalid"),
  options: z
    .array(OptionSchema)
    .nonempty("Options array shouldn't be empty.")
    .refine((options) => {
      const names = options.map((option) => option.value);
      return new Set(names).size === names.length;
    }, "Option names should be unique within the array."),
  dropdown_name: z.string().nonempty("Option dropdown name is required and cannot be empty."),
  creates_po: z.boolean(),
});
