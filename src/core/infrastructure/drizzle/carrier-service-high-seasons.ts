import type { ServiceHighSeason } from "~/core/domain/carriers/entity";
import type { Transaction } from "~/core/domain/types";
import { eq } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { carrier_service_high_seasons } from "~/schema/carriers";

export class CarrierServiceHighSeasonsDS {
  static async getByServiceID(service_id: number) {
    return db
      .select({
        carrier_service_high_season_id: carrier_service_high_seasons.carrier_service_high_season_id,
        carrier_service_id: carrier_service_high_seasons.carrier_service_id,
        start_date: carrier_service_high_seasons.start_date,
        end_date: carrier_service_high_seasons.end_date,
        extra_time: carrier_service_high_seasons.extra_time,
      })
      .from(carrier_service_high_seasons)
      .where(eq(carrier_service_high_seasons.carrier_service_id, service_id))
      .prepare()
      .execute();
  }

  static async createMany(high_seasons: ServiceHighSeason[], service_id: number, tx?: Transaction) {
    return (tx || db)
      .insert(carrier_service_high_seasons)
      .values(
        high_seasons.map((high_season) => ({
          carrier_service_id: service_id,
          ...high_season,
        })),
      )
      .prepare()
      .execute();
  }

  static async updateMany(high_seasons: ServiceHighSeason[], service_id: number, tx?: Transaction) {
    return Promise.all(
      high_seasons.map(async (high_season) =>
        (tx || db)
          .update(carrier_service_high_seasons)
          .set(high_season)
          .where(eq(carrier_service_high_seasons.carrier_service_id, service_id))
          .prepare()
          .execute(),
      ),
    );
  }

  static async deleteByServiceID(service_id: number, tx?: Transaction) {
    return (tx || db)
      .delete(carrier_service_high_seasons)
      .where(eq(carrier_service_high_seasons.carrier_service_id, service_id))
      .prepare()
      .execute();
  }
}
