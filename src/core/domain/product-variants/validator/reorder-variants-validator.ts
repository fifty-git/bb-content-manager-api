import { z } from "zod";

export const ReorderVariantsAPISchema = z.object({
  product_id: z.number().min(1, "Product ID is invalid"),
  variants: z.array(z.number().min(1, "Variant ID is invalid")).nonempty("List of variants cannot be empty"),
});
