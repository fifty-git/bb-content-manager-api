import { z } from "zod";
import { ServiceType } from "../entity";

export const CreateCarrierSchema = z.object({
  carrier: z.object({
    code: z.string().nonempty(),
    name: z.string().nonempty(),
    account_number: z.string().nonempty(),
  }),
});

export const UpdateCarrierSchema = z.object({
  carrier: z.object({
    code: z.string().nonempty().optional(),
    name: z.string().nonempty().optional(),
    account_number: z.string().nonempty().optional(),
  }),
});

export const CreateServiceSchema = z.object({
  service: z.object({
    code: z.string().nonempty(),
    name: z.string().nonempty(),
    type: z.enum([ServiceType.INT, ServiceType.DOM]).optional(),
  }),
});

export const UpdateServiceSchema = z.object({
  service: z.object({
    code: z.string().nonempty().optional(),
    name: z.string().nonempty().optional(),
    type: z.enum([ServiceType.INT, ServiceType.DOM]).optional(),
  }),
});
