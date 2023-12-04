import { z } from "zod";

export const CreateTagAPISchema = z.object({
  product_id: z.number().min(1, "Product ID is invalid"),
  name: z.string().trim().nonempty("Tag name is required and cannot be empty"),
  type: z.string().nonempty("Type is required and cannot be empty"),
  searchable: z.boolean(),
});
