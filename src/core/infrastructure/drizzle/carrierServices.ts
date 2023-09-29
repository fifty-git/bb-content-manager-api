import { Transaction } from "~/core/domain/types";
import { carrier_services } from "~/schema/carriers";
import { db } from "~/modules/drizzle";
import { eq, sql } from "drizzle-orm";
import {
  DeleteService,
  NewService,
  Service,
  UpdateService,
} from "~/core/domain/carriers/entity";

export class CarrierServiceDS {
  static async getByCarrier(carrier_id: number, tx?: Transaction) {
    const fields = {
      carrier_service_id: carrier_services.carrier_service_id,
      name: carrier_services.name,
      type: carrier_services.type,
      code: carrier_services.code,
      carrier_id: carrier_services.carrier_id,
    };
    const results = await (tx || db).select(fields).from(carrier_services)
      .where(sql`carrier_id = ${carrier_id}`);

    return results.length > 0 ? results as Service[] : undefined;
  }

  static async getByIds(
    carrier_id: number,
    service_id: number,
    tx?: Transaction,
  ) {
    const fields = {
      carrier_service_id: carrier_services.carrier_service_id,
      name: carrier_services.name,
      type: carrier_services.type,
      code: carrier_services.code,
      carrier_id: carrier_services.carrier_id,
    };
    const results = await (tx || db).select(fields).from(carrier_services)
      .where(
        sql`carrier_id = ${carrier_id} AND carrier_service_id = ${service_id}`,
      );

    return results.length > 0 ? results[0] as Service : undefined;
  }

  static async create(new_service: NewService, tx?: Transaction) {
    return (await (tx || db).insert(carrier_services).values(new_service)
      .prepare().execute())[0];
  }

  static async createMany(new_services: NewService[], tx?: Transaction) {
    return tx
      ? tx.insert(carrier_services).values(new_services).prepare().execute()
      : db.insert(carrier_services).values(new_services).prepare().execute();
  }

  static async update(service: UpdateService, tx?: Transaction) {
    return (await (tx || db).update(carrier_services).set(service).where(
      sql`carrier_id = ${service.carrier_id} AND carrier_service_id = ${service.carrier_service_id}`,
    )
      .prepare().execute())[0];
  }

  static async delete(service: DeleteService, tx?: Transaction) {
    return (await (tx || db).delete(carrier_services).where(
      sql`carrier_id = ${service.carrier_id} AND carrier_service_id = ${service.carrier_service_id}`,
    ).prepare().execute())[0];
  }
}
