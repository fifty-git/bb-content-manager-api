import { db } from "~/modules/drizzle";
import { sales_channels } from "~/schema/sales-channels";

export class SalesChannelsDS {
  static async getAll() {
    return db.select().from(sales_channels).prepare().execute();
  }
}
