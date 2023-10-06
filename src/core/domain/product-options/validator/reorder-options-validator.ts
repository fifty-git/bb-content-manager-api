import { z } from "zod";

export const ReorderOptionsAPISchema = z.object({
  variant_id: z.number().min(1, "Variant ID is invalid"),
  options: z.array(z.number().min(1, "Variant Option ID is invalid")).nonempty("List of variant options cannot be empty"),
});
