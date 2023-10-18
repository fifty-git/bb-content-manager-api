import { z } from "zod";
import { Days, ServiceType } from "../entity";

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
    cities: z.array(
      z.object({
        city_id: z.number(),
        transit_days: z.number(),
      }),
    ),
    days: z.array(z.enum([Days.MON, Days.TUE, Days.WED, Days.THU, Days.FRI, Days.SAT, Days.SUN])),
    type: z.enum([ServiceType.INT, ServiceType.DOM]).optional(),
  }),
});

export const UpdateServiceSchema = z.object({
  service: z.object({
    code: z.string().trim().nonempty().optional(),
    name: z.string().trim().nonempty().optional(),
    transit_days: z.array(z.enum([Days.MON, Days.TUE, Days.WED, Days.THU, Days.FRI, Days.SAT, Days.SUN])).optional(),
    type: z.enum([ServiceType.INT, ServiceType.DOM]).optional(),
  }),
});
