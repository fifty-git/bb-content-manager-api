import type { Transaction } from "~/core/domain/types";
import { eq } from "drizzle-orm";
import { type Carrier, type NewCarrier, type UpdateCarrier } from "~/core/domain/carriers/entity";
import { db } from "~/modules/drizzle";
import { carriers } from "~/schema/carriers";

export class CarriersDS {
  static async get(carrier_id: number): Promise<Carrier> {
    return (await db
      .select({
        carrier_id: carriers.carrier_id,
        name: carriers.name,
        code: carriers.code,
        account_number: carriers.account_number,
        status: carriers.status,
      })
      .from(carriers)
      .where(eq(carriers.carrier_id, carrier_id))
      .prepare()
      .execute())[0];
  }

  static getAll(): Promise<Carrier[]> {
    const fields = {
      carrier_id: carriers.carrier_id,
      name: carriers.name,
      code: carriers.code,
      account_number: carriers.account_number,
      status: carriers.status,
    };

    return db.select(fields).from(carriers).prepare().execute();
  }

  static async create(new_carrier: NewCarrier, tx?: Transaction) {
    return (await (tx || db).insert(carriers).values(new_carrier).prepare().execute())[0];
  }

  static createMany(new_carriers: NewCarrier[], tx?: Transaction) {
    return (tx || db).insert(carriers).values(new_carriers).prepare().execute();
  }

  static async update(carrier: UpdateCarrier, tx?: Transaction) {
    return (await (tx || db).update(carriers).set(carrier).where(eq(carriers.carrier_id, carrier.carrier_id)).prepare().execute())[0];
  }

  static async delete(carrier_id: number, tx?: Transaction) {
    return (await (tx || db).delete(carriers).where(eq(carriers.carrier_id, carrier_id)).prepare().execute())[0];
  }
}
