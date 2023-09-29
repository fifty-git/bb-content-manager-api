import { z } from "zod";
import { ServiceType } from "../entity";

export const CreateCarrierSchema = z.object({
  carrier: z.object({
    code: z.string(),
    name: z.string(),
    account_number: z.string(),
  }),
});

export const UpdateCarrierSchema = z.object({
  carrier: z.object({
    code: z.string().optional(),
    name: z.string().optional(),
    account_number: z.string().optional(),
  }),
});

export const CreateServiceSchema = z.object({
  service: z.object({
    code: z.string(),
    name: z.string(),
    type: z.enum([ServiceType.INT, ServiceType.DOM]).optional(),
  }),
});

export const UpdateServiceSchema = z.object({
  service: z.object({
    code: z.string().optional(),
    name: z.string().optional(),
    type: z.enum([ServiceType.INT, ServiceType.DOM]).optional(),
  }),
});
