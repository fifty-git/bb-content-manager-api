import { z } from "zod";

export const NewGroupSchema = z.object({
  name: z
    .string({ required_error: "Group name is required", invalid_type_error: "Group name must be a string" })
    .max(50, { message: "Group name must be at maximum of 50 chars" }),
  parent_group_id: z.number({ invalid_type_error: "Parent group id must be a number" }).optional(),
});
