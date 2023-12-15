import type { CarrierServiceAccount, UpdateCarrierServiceAccount } from "~/core/domain/carrier-service-accounts/types";
import type { Transaction } from "~/core/domain/types";
import { eq } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { carrier_accounts } from "~/schema/carriers";

export class CarrierServicesAccountsDS {
  static getAllAccounts() {
    return db
      .select({
        account_id: carrier_accounts.account_id,
        account_name: carrier_accounts.account_name,
        account_number: carrier_accounts.account_number,
        status: carrier_accounts.status,
      })
      .from(carrier_accounts)
      .prepare()
      .execute();
  }

  static async create(account: CarrierServiceAccount, tx?: Transaction) {
    return (await (tx || db).insert(carrier_accounts).values(account).prepare().execute())[0];
  }

  static async update(account: UpdateCarrierServiceAccount, tx?: Transaction) {
    return await (tx || db)
      .update(carrier_accounts)
      .set(account)
      .where(eq(carrier_accounts.account_id, account.account_id))
      .prepare()
      .execute();
  }

  static async delete(account_id: number, tx?: Transaction) {
    return (await (tx || db).delete(carrier_accounts).where(eq(carrier_accounts.account_id, account_id)).prepare().execute())[0];
  }
}
