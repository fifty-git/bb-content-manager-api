import { NewCarrierAccount } from "~/core/domain/carriers/entity";
import { Transaction } from "~/core/domain/types";
import { db } from "~/modules/drizzle";
import { carrier_accounts } from "~/schema/carriers";

export class CarrierAccountsDS {
  static async create(new_account: NewCarrierAccount, tx?: Transaction) {
    return ( await (tx || db).insert(carrier_accounts).values(new_account).prepare().execute())[0];
  }
}
