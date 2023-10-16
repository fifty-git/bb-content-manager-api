import { z } from "zod";
import { ServiceType } from "../entity";

export const CreateCarrierSchema = z.object({
  carrier: z.object({
    code: z.string().trim().nonempty(),
    name: z.string().trim().nonempty(),
    account_number: z.string().trim().nonempty(),
  }),
});

export const UpdateCarrierSchema = z.object({
  carrier: z.object({
    code: z.string().trim().nonempty().optional(),
    name: z.string().trim().nonempty().optional(),
    account_number: z.string().trim().nonempty().optional(),
  }),
});

export const CreateServiceSchema = z.object({
  service: z.object({
    code: z.string().trim().nonempty(),
    name: z.string().trim().nonempty(),
    transit_days: z.number().min(1).max(127).optional(),
    type: z.enum([ServiceType.INT, ServiceType.DOM]).optional(),
  }),
});

export const UpdateServiceSchema = z.object({
  service: z.object({
    code: z.string().trim().nonempty().optional(),
    name: z.string().trim().nonempty().optional(),
    transit_days: z.number().min(1).max(127).optional(),
    type: z.enum([ServiceType.INT, ServiceType.DOM]).optional(),
  }),
});
