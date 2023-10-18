import type { Days } from "~/core/domain/carriers/entity";
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

  static async createMany(days: Days[], service_id: number, tx?: Transaction) {
    return Promise.all(
      days.map((day) =>
        (tx || db)
          .insert(carrier_service_days)
          .values({
            carrier_service_id: service_id,
            day_name: day,
          })
          .prepare()
          .execute(),
      ),
    );
  }

  static async deleteByServiceID(service_id: number, tx?: Transaction) {
    return (tx || db).delete(carrier_service_days).where(eq(carrier_service_days.carrier_service_id, service_id)).prepare().execute();
  }
}
