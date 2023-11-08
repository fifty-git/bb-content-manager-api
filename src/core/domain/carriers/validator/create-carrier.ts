import { z } from "zod";
import { Days, ServiceType } from "../entity";

export const CreateCarrierAccountSchema = z.object({
  account: z.object({
    account_number: z.string().nonempty(),
    account_name: z.string().nonempty()
  })
});

export const CreateCarrierSchema = z.object({
  carrier: z.object({
    name: z.string().trim().nonempty(),
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
    name: z.string().trim().nonempty(),
    days: z.array(z.enum([Days.MON, Days.TUE, Days.WED, Days.THU, Days.FRI, Days.SAT, Days.SUN])),
    type: z.enum([ServiceType.INT, ServiceType.DOM]).optional(),
    accounts: z.array(z.number()).optional(),
  }),
});

export const UpdateServiceSchema = z.object({
  service: z.object({
    code: z.string().trim().nonempty().optional(),
    name: z.string().trim().nonempty().optional(),
    days: z.array(z.enum([Days.MON, Days.TUE, Days.WED, Days.THU, Days.FRI, Days.SAT, Days.SUN])).optional(),
    type: z.enum([ServiceType.INT, ServiceType.DOM]).optional(),
  }),
});
