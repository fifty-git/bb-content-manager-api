import { z } from "zod";

const NewProductSchema = z.object({
  name: z.string().trim().nonempty("Product name is required and cannot be empty"),
  group_id: z.number().optional(),
  subgroup_id: z.number().optional(),
  is_standalone: z.boolean(),
  product_type: z.union([z.literal("single"), z.literal("bundle")]),
});

export const CreateProductsAPISchema = z.object({
  products: z.array(NewProductSchema),
});
