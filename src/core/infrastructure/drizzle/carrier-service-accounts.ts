import { eq } from "drizzle-orm";
import { NewCarrierServiceAccount } from "~/core/domain/carriers/entity";
import { Transaction } from "~/core/domain/types";
import { db } from "~/modules/drizzle";
import {
  carrier_accounts,
  carrier_service_accounts_link,
} from "~/schema/carriers";

export class CarrierServiceAccountsDS {
  static getAllAccountsByServiceID(service_id: number) {
    return db.select({
      account_id: carrier_accounts.account_id,
      account_name: carrier_accounts.account_name,
      account_number: carrier_accounts.account_number
    }).from(carrier_accounts).innerJoin(
      carrier_service_accounts_link,
      eq(carrier_service_accounts_link.account_id, carrier_accounts.account_id),
    ).where(eq(carrier_service_accounts_link.carrier_service_id, service_id));
  }

  static async createMany(accounts: NewCarrierServiceAccount[], tx: Transaction) {
    return (tx || db).insert(carrier_service_accounts_link).values(accounts);
  }

  static async deleteByServiceID(service_id: number, tx?: Transaction) {
    return (tx || db).delete(carrier_service_accounts_link).where(eq(carrier_service_accounts_link.carrier_service_id, service_id));
  }
}
