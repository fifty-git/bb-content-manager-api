import { z } from "zod";

export const CreateAccountSchema = z.object({
  name: z.string().trim().nonempty(),
  number: z.string().trim().nonempty(),
});
