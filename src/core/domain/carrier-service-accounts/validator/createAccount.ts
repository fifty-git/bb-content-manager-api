import { z } from "zod";

export const CreateAccountSchema = z.object({
  account_name: z.string().trim().nonempty(),
  account_number: z.string().trim().nonempty(),
});
