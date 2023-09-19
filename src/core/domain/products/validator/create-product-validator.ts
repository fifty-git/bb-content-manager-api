import { z } from "zod";

const NewProductSchema = z.object({
  name: z.string(),
  group_id: z.number().optional(),
  subgroup_id: z.number().optional(),
  product_type: z.string(),
});

export const CreateProductsAPISchema = z.object({
  products: z.array(NewProductSchema),
});
