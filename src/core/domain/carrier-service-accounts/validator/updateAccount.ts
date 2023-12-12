import { z } from "zod";

export const UpdateAccountSchema = z.object({
  account_id: z.number(),
  account_name: z.string().trim().nonempty().optional(),
  account_number: z.string().trim().nonempty().optional(),
});
