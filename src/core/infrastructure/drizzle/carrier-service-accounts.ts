import { eq } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import {
  carrier_accounts,
  carrier_service_accounts_link,
} from "~/schema/carriers";

export class CarrierServiceAccountsDS {
  static getAllAccountsByServiceID(service_id: number) {
    return db.select().from(carrier_accounts).innerJoin(
      carrier_service_accounts_link,
      eq(carrier_service_accounts_link.account_id, carrier_accounts.account_id),
    ).where(eq(carrier_service_accounts_link.carrier_service_id, service_id));
  }
}
