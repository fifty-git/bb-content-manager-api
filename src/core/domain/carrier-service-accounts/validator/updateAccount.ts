import { z } from "zod";

export const UpdateAccountSchema = z.object({
  account_id: z.number(),
  name: z.string().trim().nonempty().optional(),
  number: z.string().trim().nonempty().optional(),
});
