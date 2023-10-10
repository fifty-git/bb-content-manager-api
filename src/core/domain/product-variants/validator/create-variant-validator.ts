import { z } from "zod";
import { PRICE_REGEX } from "~/core/domain/constants";

export const CreateVariantAPISchema = z.object({
  product_id: z.number().min(1, "Product ID is invalid"),
  name: z.string().trim().nonempty("Variant name is required and cannot be empty"),
  measure_units: z.string().nonempty("Measure unit is required and cannot be empty"),
  units: z.number().refine((value) => value > 0, "Units must be greater than zero"),
  price: z
    .string()
    .refine((price) => PRICE_REGEX.test(price), "Invalid price format. Price should have up to two decimal places and no currency symbols")
    .refine((price) => parseFloat(price) > 0, "Price must be greater than zero"),
  upc: z.string().trim(),
});
