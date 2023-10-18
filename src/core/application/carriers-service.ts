import type { Days, NewCarrierServiceCity, NewService, UpdateCarrier, UpdateService } from "../domain/carriers/entity";
import type { EnvAPI } from "../domain/types";
import type { Context } from "hono";
import type { SafeParseReturnType } from "zod";
import { db } from "~/modules/drizzle";
import { logger } from "~/modules/logger";
import { Status } from "../domain/carriers/entity";
import {
  CreateCarrierSchema,
  CreateServiceSchema,
  UpdateCarrierSchema,
  UpdateServiceSchema,
} from "../domain/carriers/validator/create-carrier";
import { CarrierServiceCitiesDS } from "../infrastructure/drizzle/carrier-service-cities";
import { CarrierServiceDaysDS } from "../infrastructure/drizzle/carrier-service-days";
import { CarrierServiceHighSeasonsDS } from "../infrastructure/drizzle/carrier-service-high-seasons";
import { CarrierServiceDS } from "../infrastructure/drizzle/carrier-services";
import { CarriersDS } from "../infrastructure/drizzle/carriers";

function handleValidationErrors(validator: SafeParseReturnType<any, any>, c: any) {
  if (!validator.success) {
    return c.json(
      {
        status: "error",
        data: validator.error.errors,
        msg: "incorrect payload",
      },
      400,
    );
  }
}

export async function getAllCarriers(c: Context<EnvAPI>) {
  const carriers = await CarriersDS.getAll();
  const composed = await Promise.all(
    carriers.map(async (carrier) => {
      const services = await CarrierServiceDS.getByCarrierID(carrier.carrier_id);
      const composedServices = await Promise.all(services.map(async (service) => {
        const cities = await CarrierServiceCitiesDS.getByServiceID(service.carrier_service_id);
        const days = await CarrierServiceDaysDS.getByServiceID(service.carrier_service_id);
        const high_seasons = await CarrierServiceHighSeasonsDS.getByServiceID(service.carrier_service_id);

        return {
          ...service,
          cities,
          days,
          high_seasons,
        };
      }));

      return {
        ...carrier,
        services: composedServices,
      };
    }),
  );

  return c.json(
    {
      status: carriers ? "success" : "error",
      data: composed,
    },
    200,
  );
}

export async function getCarrierById(c: Context<EnvAPI>) {
  const id = Number(c.req.param("carrier_id"));
  const carrier = await CarriersDS.get(id);
  const services = await CarrierServiceDS.getByCarrierID(id);
  const composedServices = await Promise.all(services.map(async (service) => {
    const cities = await CarrierServiceCitiesDS.getByServiceID(service.carrier_service_id);
    const days = await CarrierServiceDaysDS.getByServiceID(service.carrier_service_id);
    const high_seasons = await CarrierServiceHighSeasonsDS.getByServiceID(service.carrier_service_id);

    return {
      ...service,
      cities,
      days,
      high_seasons,
    };
  }));
  const composed = [{ ...carrier, services: composedServices }];

  return c.json(
    {
      status: carrier ? "success" : "error",
      data: composed,
    },
    200,
  );
}

export async function getAllCarrierServices(c: Context<EnvAPI>) {
  const id = Number(c.req.param("carrier_id"));
  const services = await CarrierServiceDS.getByCarrierID(id);
  const composedServices = await Promise.all(services.map(async (service) => {
    const cities = await CarrierServiceCitiesDS.getByServiceID(service.carrier_service_id);
    const days = await CarrierServiceDaysDS.getByServiceID(service.carrier_service_id);
    const high_seasons = await CarrierServiceHighSeasonsDS.getByServiceID(service.carrier_service_id);

    return {
      ...service,
      cities,
      days,
      high_seasons,
    };
  }));

  return c.json(
    {
      status: composedServices ? "success" : "error",
      data: composedServices,
    },
    200,
  );
}

export async function getCarrierServicesById(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const service_id = Number(c.req.param("service_id"));
  const services = await CarrierServiceDS.getByIDs(carrier_id, service_id);
  const composedServices = services.map(async (service) => {
    const cities = await CarrierServiceCitiesDS.getByServiceID(service.carrier_service_id);
    const days = await CarrierServiceDaysDS.getByServiceID(service.carrier_service_id);
    const high_seasons = await CarrierServiceHighSeasonsDS.getByServiceID(service.carrier_service_id);

    return {
      ...service,
      cities,
      days,
      high_seasons,
    };
  });

  return c.json(
    {
      status: composedServices ? "success" : "error",
      data: composedServices,
    },
    200,
  );
}

export async function createCarrier(c: Context<EnvAPI>) {
  const payload = await c.req.json();
  const validator = CreateCarrierSchema.safeParse(payload);
  if (!validator.success) return handleValidationErrors(validator, c);
  const created = await CarriersDS.create(payload.carrier);

  return c.json(
    {
      status: created?.insertId ? "success" : "error",
      data: { id: created?.insertId },
      msg: created?.insertId ? "carrier successfully created" : "cannot create carrier",
    },
    201,
  );
}

export async function createService(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const payload = await c.req.json();
  const validator = CreateServiceSchema.safeParse(payload);
  if (!validator.success) return handleValidationErrors(validator, c);

  const created = await db.transaction(async (tx) => {
    try {
      const insertedService = await CarrierServiceDS.create(
        {
          ...(payload.service as NewService),
          carrier_id,
        },
        tx,
      );
      const cities: NewCarrierServiceCity[] = payload.service.cities.map((city: NewCarrierServiceCity) => ({
        ...city,
        carrier_service_id: insertedService.insertId,
      }));
      const days: Days[] = payload.service.days;
      await CarrierServiceCitiesDS.createMany(cities, tx);
      await CarrierServiceDaysDS.createMany(days, insertedService.insertId, tx);

      if (payload.service.high_seasons) {
        const seasons = payload.service.high_seasons.map((high_season: any) => ({
          ...high_season,
          start_date: new Date(high_season.start_date),
          end_date: new Date(high_season.end_date),
        }));
        await CarrierServiceHighSeasonsDS.createMany(seasons, insertedService.insertId, tx);
      }

      return insertedService;
    } catch (error) {
      logger.error(error);
      tx.rollback();
    }
  });

  return c.json(
    {
      status: created?.insertId ? "success" : "error",
      data: { id: created?.insertId },
      msg: created?.insertId ? "service successfully created" : "cannot create service",
    },
    201,
  );
}

export async function updateCarrier(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const payload: { carrier: UpdateCarrier } = await c.req.json();
  const validator = UpdateCarrierSchema.safeParse(payload);
  if (!validator.success) return handleValidationErrors(validator, c);
  const updated = await CarriersDS.update({
    ...(payload.carrier as UpdateCarrier),
    carrier_id,
  });

  return c.json(
    {
      status: updated?.affectedRows === 1 ? "success" : "error",
      data: { carrier_id },
      msg: updated?.affectedRows === 1 ? "carrier successfully updated" : "cannot update carrier",
    },
    200,
  );
}

export async function updateService(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const service_id = Number(c.req.param("service_id"));
  const payload = await c.req.json();
  const service: UpdateService = payload.service;
  const validator = UpdateServiceSchema.safeParse(payload);
  if (!validator.success) return handleValidationErrors(validator, c);

  const updated = await db.transaction(async (tx) => {
    try {
      await CarrierServiceDS.update(
        {
          code: service.code,
          name: service.name,
          type: service.type,
          carrier_id,
          carrier_service_id: service_id,
        },
        tx,
      );

      if (service.cities) {
        const cities = service.cities.map((city) => ({ ...city, carrier_service_id: service_id}));
        await CarrierServiceCitiesDS.deleteByServiceID(service_id, tx);
        await CarrierServiceCitiesDS.createMany(cities, tx);
      }

      if (service.days) {
        await CarrierServiceDaysDS.deleteByServiceID(service_id, tx);
        await CarrierServiceDaysDS.createMany(service.days, service_id, tx);
      }

      if (service.high_seasons) {
        await CarrierServiceHighSeasonsDS.deleteByServiceID(service_id, tx);
        await CarrierServiceHighSeasonsDS.createMany(service.high_seasons.map((high_season) => ({
          ...high_season,
          start_date: new Date(high_season.start_date),
          end_date: new Date(high_season.end_date),
        })), service_id, tx);
      }

      return true;
    } catch (error) {
      logger.error(error);
      tx.rollback();
    }
  });

  return c.json(
    {
      status: updated ? "success" : "error",
      data: { carrier_id, service_id },
      msg: updated ? "service successfully updated" : "cannot update service",
    },
    200,
  );
}

export async function activateCarrier(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const services = await CarrierServiceDS.getByCarrierID(carrier_id);
  const results = await db.transaction(async (tx) => {
    await CarriersDS.update(
      {
        carrier_id,
        status: Status.ACTIVE,
      },
      tx,
    );

    const updates = services.map((service) =>
      CarrierServiceDS.update(
        {
          carrier_id: service.carrier_id,
          carrier_service_id: service.carrier_service_id,
          status: Status.ACTIVE,
        },
        tx,
      ),
    );

    return Promise.all(updates);
  });

  return c.json(
    {
      status:
        results.map((result) => result.affectedRows).filter((affectedRows) => affectedRows === 1).length === services.length
          ? "success"
          : "failed",
      msg: "carrier activated successfully",
      data: {
        carrier_id,
        carrier_service_id: services.map((service) => service.carrier_service_id),
      },
    },
    200,
  );
}

export async function activateService(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const service_id = Number(c.req.param("service_id"));
  const updated = await CarrierServiceDS.update({
    carrier_id,
    carrier_service_id: service_id,
    status: Status.ACTIVE,
  });

  return c.json(
    {
      status: updated.affectedRows === 1 ? "success" : "failed",
      msg: "service activated successfully",
      data: { carrier_id, service_id },
    },
    200,
  );
}

export async function deactivateCarrier(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const services = await CarrierServiceDS.getByCarrierID(carrier_id);
  const results = await db.transaction(async (tx) => {
    await CarriersDS.update(
      {
        carrier_id,
        status: Status.INACTIVE,
      },
      tx,
    );

    const updates = services.map((service) =>
      CarrierServiceDS.update(
        {
          carrier_id: service.carrier_id,
          carrier_service_id: service.carrier_service_id,
          status: Status.INACTIVE,
        },
        tx,
      ),
    );

    return Promise.all(updates);
  });

  return c.json(
    {
      status:
        results.map((result) => result.affectedRows).filter((affectedRows) => affectedRows === 1).length === services.length
          ? "success"
          : "failed",
      msg: "carrier deactivated successfully",
      data: {
        carrier_id,
        carrier_service_id: services.map((service) => service.carrier_service_id),
      },
    },
    200,
  );
}

export async function deactivateService(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const service_id = Number(c.req.param("service_id"));
  const updated = await CarrierServiceDS.update({
    carrier_id,
    carrier_service_id: service_id,
    status: Status.INACTIVE,
  });

  return c.json(
    {
      status: updated.affectedRows === 1 ? "success" : "failed",
      msg: "service deactivated successfully",
      data: { carrier_id, service_id },
    },
    200,
  );
}

export async function deleteCarrier(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const deleted = await db.transaction(async (tx) => {
    try {
      const services = await CarrierServiceDS.getByCarrierID(carrier_id);
      await Promise.all(services.map((service) => CarrierServiceCitiesDS.deleteByServiceID(service.carrier_service_id, tx)));
      await Promise.all(services.map((service) => CarrierServiceDaysDS.deleteByServiceID(service.carrier_service_id, tx)));
      await Promise.all(services.map((service) => CarrierServiceHighSeasonsDS.deleteByServiceID(service.carrier_service_id, tx)));
      await CarrierServiceDS.deleteByCarrierID(carrier_id, tx);
      return CarriersDS.delete(carrier_id, tx);
    } catch (error) {
      logger.error(error);
      tx.rollback();
    }
  });

  return c.json(null, deleted?.affectedRows === 1 ? 204 : 500);
}

export async function deleteService(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const service_id = Number(c.req.param("service_id"));
  const deleted = await db.transaction(async (tx) => {
    try {
      await CarrierServiceCitiesDS.deleteByServiceID(service_id, tx);
      await CarrierServiceDaysDS.deleteByServiceID(service_id, tx);
      await CarrierServiceHighSeasonsDS.deleteByServiceID(service_id, tx);
      return CarrierServiceDS.delete(
        {
          carrier_id,
          carrier_service_id: service_id,
        },
        tx,
      );
    } catch (error) {
      logger.error(error);
      tx.rollback();
    }
  });

  return c.json(null, deleted?.affectedRows === 1 ? 204 : 500);
}
