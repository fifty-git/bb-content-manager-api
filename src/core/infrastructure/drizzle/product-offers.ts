import type { NewOffer } from "~/core/domain/product-offers/entity";
import type { Transaction } from "~/core/domain/types";
import { eq } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { product_offers } from "~/schema/product-offers";

export class OffersDS {
  static async getAllByProductID(product_id: number) {
    return db
      .select({
        product_offer_id: product_offers.product_offer_id,
        sales_channel_id: product_offers.sales_channel_id,
        name: product_offers.name,
        status: product_offers.status,
      })
      .from(product_offers)
      .where(eq(product_offers.product_id, product_id))
      .prepare()
      .execute();
  }

  static async create(offer: NewOffer, tx?: Transaction) {
    return (tx ?? db).insert(product_offers).values(offer).prepare().execute();
  }
}
