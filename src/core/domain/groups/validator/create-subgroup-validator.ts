import { z } from "zod";

export const NewSubGroupSchema = z.object({
  name: z
    .string({ required_error: "Group name is required", invalid_type_error: "Group name must be a string" })
    .min(1, { message: "Group name must be at minimun of 1 char." })
    .max(50, { message: "Group name must be at maximum of 50 chars" }),
  parent_group_id: z.number({ required_error: "Parent group ID is required", invalid_type_error: "Parent group id must be a number" }),
});
