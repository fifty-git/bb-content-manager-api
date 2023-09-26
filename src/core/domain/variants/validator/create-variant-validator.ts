import { z } from "zod";
import { PRICE_REGEX } from "~/core/domain/constants";

export const CreateVariantAPISchema = z.object({
  product_id: z
    .number()
    .int()
    .refine((id) => id > 0, "Product ID is invalid"),
  name: z.string(),
  measure_units: z.string().nonempty("Measure unit must not be empty"),
  units: z.number().refine((value) => value > 0, "Units must be greater than zero"),
  price: z
    .string()
    .refine((value) => PRICE_REGEX.test(value), "Invalid price format. Price should have up to two decimal places and no currency symbols.")
    .refine((value) => parseFloat(value) > 0, "Price must be greater than zero"),
  upc: z.string(),
});
