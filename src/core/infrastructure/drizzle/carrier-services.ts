import type { Transaction } from "~/core/domain/types";
import { and, eq } from "drizzle-orm";
import { type DeleteService, type NewService, type Service, type UpdateService } from "~/core/domain/carriers/entity";
import { db } from "~/modules/drizzle";
import { carrier_services } from "~/schema/carriers";

export class CarrierServiceDS {
  static async getByCarrierID(carrier_id: number): Promise<Service[]> {
    return db
      .select({
        carrier_service_id: carrier_services.carrier_service_id,
        carrier_id: carrier_services.carrier_id,
        name: carrier_services.name,
        type: carrier_services.type,
        code: carrier_services.code,
        transit_days: carrier_services.transit_days,
        status: carrier_services.status,
      })
      .from(carrier_services)
      .where(eq(carrier_services.carrier_id, carrier_id))
      .prepare()
      .execute();
  }

  static async getByIds(carrier_id: number, service_id: number): Promise<Service[]> {
    return db
      .select({
        carrier_service_id: carrier_services.carrier_service_id,
        carrier_id: carrier_services.carrier_id,
        name: carrier_services.name,
        type: carrier_services.type,
        code: carrier_services.code,
        transit_days: carrier_services.transit_days,
        status: carrier_services.status,
      })
      .from(carrier_services)
      .where(and(eq(carrier_services.carrier_id, carrier_id), eq(carrier_services.carrier_service_id, service_id)))
      .prepare()
      .execute();
  }

  static async create(new_service: NewService, tx?: Transaction) {
    return (await (tx || db).insert(carrier_services).values(new_service).prepare().execute())[0];
  }

  static async createMany(new_services: NewService[], tx?: Transaction) {
    return (tx || db).insert(carrier_services).values(new_services).prepare().execute();
  }

  static async update(service: UpdateService, tx?: Transaction) {
    return (
      await (tx || db)
        .update(carrier_services)
        .set(service)
        .where(
          and(eq(carrier_services.carrier_id, service.carrier_id), eq(carrier_services.carrier_service_id, service.carrier_service_id)),
        )
        .prepare()
        .execute()
    )[0];
  }

  static async delete(service: DeleteService, tx?: Transaction) {
    return (
      await (tx || db)
        .delete(carrier_services)
        .where(
          and(eq(carrier_services.carrier_id, service.carrier_id), eq(carrier_services.carrier_service_id, service.carrier_service_id)),
        )
        .prepare()
        .execute()
    )[0];
  }
}
