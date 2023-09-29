import type { Carrier, NewCarrier, UpdateCarrier } from "~/core/domain/carriers/entity";
import type { Transaction } from "~/core/domain/types";
import { and, eq, ne } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { carriers } from "~/schema/carriers";

export class CarriersDS {
  static async get(carrier_id: number): Promise<Carrier[]> {
    return db
      .select({
        carrier_id: carriers.carrier_id,
        name: carriers.name,
        code: carriers.code,
        account_number: carriers.account_number,
      })
      .from(carriers)
      .where(and(eq(carriers.carrier_id, carrier_id), ne(carriers.active, 0)))
      .prepare()
      .execute();
  }

  static getAll(): Promise<Carrier[]> {
    const fields = {
      carrier_id: carriers.carrier_id,
      name: carriers.name,
      code: carriers.code,
      account_number: carriers.account_number,
    };

    return db.select(fields).from(carriers).where(ne(carriers.active, 0)).prepare().execute();
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
    return (await (tx || db).update(carriers).set({ active: 0 }).where(eq(carriers.carrier_id, carrier_id)).prepare().execute())[0];
  }
}
