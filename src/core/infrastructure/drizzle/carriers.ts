import {
  Carrier,
  NewCarrier,
  UpdateCarrier,
} from "~/core/domain/carriers/entity";
import { Transaction } from "~/core/domain/types";
import { carriers } from "~/schema/carriers";
import { db } from "~/modules/drizzle";
import { eq, sql } from "drizzle-orm";

export class CarriersDS {
  static async get(carrier_id: number, tx?: Transaction) {
    const fields = {
      carrier_id: carriers.carrier_id,
      name: carriers.name,
      code: carriers.code,
      account_number: carriers.account_number,
    };

    const results = await (tx || db).select(fields).from(carriers).where(
      sql`carrier_id = ${carrier_id} AND active != FALSE`,
    );

    return results.length > 0 ? results[0] as Carrier : undefined;
  }

  static async getAll(tx?: Transaction) {
    const fields = {
      carrier_id: carriers.carrier_id,
      name: carriers.name,
      code: carriers.code,
      account_number: carriers.account_number,
    };

    const results = await (tx || db).select(fields).from(carriers).where(
      sql`active != FALSE`,
    );

    return results.length > 0 ? results as Carrier[] : undefined;
  }

  static async create(new_carrier: NewCarrier, tx?: Transaction) {
    return (await (tx || db).insert(carriers).values(new_carrier).prepare().execute())[0];
  }

  static async createMany(new_carriers: NewCarrier[], tx?: Transaction) {
    return (tx || db).insert(carriers).values(new_carriers).prepare().execute();
  }

  static async update(carrier: UpdateCarrier, tx?: Transaction) {
    return (tx || db).update(carriers).set(carrier).where().prepare().execute();
  }

  static async delete(carrier_id: number, tx?: Transaction) {
    return (tx || db).delete(carriers).where(
      eq(carriers.carrier_id, carrier_id),
    ).prepare().execute();
  }
}
