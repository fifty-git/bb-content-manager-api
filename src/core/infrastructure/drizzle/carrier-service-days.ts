import type { Days, NewCarrierServiceDay } from "~/core/domain/carriers/entity";
import type { Transaction } from "~/core/domain/types";
import { eq } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { carrier_service_days } from "~/schema/carriers";

export class CarrierServiceDaysDS {
  static async getByServiceID(service_id: number, tx?: Transaction): Promise<Days[]> {
    return (
      await (tx || db)
        .select({
          day_name: carrier_service_days.day_name,
        })
        .from(carrier_service_days)
        .where(eq(carrier_service_days.carrier_service_id, service_id))
    ).map(({ day_name }) => day_name);
  }

  static async createMany(days: NewCarrierServiceDay[], tx?: Transaction) {
    return (tx || db).insert(carrier_service_days).values(days).prepare().execute();
  }

  static async deleteByServiceID(service_id: number, tx?: Transaction) {
    return (tx || db).delete(carrier_service_days).where(eq(carrier_service_days.carrier_service_id, service_id)).prepare().execute();
  }
}
