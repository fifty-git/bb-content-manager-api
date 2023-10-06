import { z } from "zod";
import { PRICE_REGEX } from "~/core/domain/constants";

export const CreateBundleVariantAPISchema = z.object({
  bundle_id: z.number().min(1, "Product ID is invalid"),
  name: z.string(),
  price: z
    .string()
    .refine((price) => PRICE_REGEX.test(price), "Invalid price format. Price should have up to two decimal places and no currency symbols")
    .refine((price) => parseFloat(price) > 0, "Price must be greater than zero"),
  upc: z.string(),
});
