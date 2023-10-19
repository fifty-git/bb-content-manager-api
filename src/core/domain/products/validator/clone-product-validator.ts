import { z } from "zod";

export const CloneProductAPISchema = z.object({
  product_id: z.number().min(1, "Product ID is invalid"),
  name: z.string().trim().nonempty("Product name is required and cannot be empty"),
  sales_channel_id: z.number().min(1, "Sales Channel ID is invalid"),
  group_id: z.number().optional(),
  subgroup_id: z.number().optional(),
  cloning_type: z.union([z.literal("reference"), z.literal("value")]),
  product_type: z.union([z.literal("single"), z.literal("bundle")]),
});
