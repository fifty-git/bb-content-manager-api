import { z } from "zod";

export const CreateOfferAPISchema = z.object({
  name: z.string().trim().nonempty("Product name is required and cannot be empty"),
  sales_channel_id: z.number().min(1),
});
