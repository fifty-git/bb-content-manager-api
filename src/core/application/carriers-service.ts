import type {
  Days,
  NewCarrierServiceAccount,
  NewCarrierServiceDay,
  NewService,
  ServiceOrigin,
  UpdateService,
} from "../domain/carriers/entity";
import type { EnvAPI } from "../domain/types";
import type { Context } from "hono";
import { type SafeParseReturnType } from "zod";
import { db } from "~/modules/drizzle";
import { logger } from "~/modules/logger";
import { Status } from "../domain/carriers/entity";
import { CreateServiceSchema, UpdateServiceSchema } from "../domain/carriers/validator/create-carrier";
import { CarrierServiceCitiesAccountsLink } from "../infrastructure/drizzle/carrier-service-cities-accounts-link";
import { CarrierServiceDaysDS } from "../infrastructure/drizzle/carrier-service-days";
import { CarrierServiceDS } from "../infrastructure/drizzle/carrier-services";

function handleValidationErrors(validator: SafeParseReturnType<any, any>, c: any) {
  if (!validator.success) {
    logger.error(validator.error);
    return c.json(
      {
        status: "error",
        msg: `${validator.error.errors[0].message} (${validator.error.errors[0].path.join(".")})`,
      },
      400,
    );
  }
}

export async function getAllCarrierServices(c: Context<EnvAPI>) {
  const id = Number(c.req.param("carrier_id"));
  const services = await CarrierServiceDS.getByCarrierID(id);
  const composedServices = await Promise.all(
    services.map(async (service) => {
      const days = await CarrierServiceDaysDS.getByServiceID(service.carrier_service_id);
      const origins = await CarrierServiceCitiesAccountsLink.getByServiceID(service.carrier_service_id);

      return {
        ...service,
        days,
        origins,
      };
    }),
  );

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
  const composedServices = await Promise.all(
    services.map(async (service) => {
      const days = await CarrierServiceDaysDS.getByServiceID(service.carrier_service_id);
      const origins = await CarrierServiceCitiesAccountsLink.getByServiceID(service.carrier_service_id);

      return {
        ...service,
        days,
        origins,
      };
    }),
  );

  return c.json(
    {
      status: composedServices ? "success" : "error",
      data: composedServices,
    },
    200,
  );
}

export async function createService(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const payload = await c.req.json();
  const validator = CreateServiceSchema.safeParse(payload);
  const service: NewService = payload.service;

  if (!validator.success) return handleValidationErrors(validator, c);
  const created = await db.transaction(async (tx) => {
    const insertedService = await CarrierServiceDS.create(
      {
        ...service,
        carrier_id,
      },
      tx,
    );

    const days: NewCarrierServiceDay[] = service.days.map((day: Days) => ({
      carrier_service_id: insertedService.insertId,
      day_name: day,
    }));

    if (service.origins && service.origins.length > 0) {
      const origins = payload.service.origins.map((origin: NewCarrierServiceAccount) => ({
        carrier_service_id: insertedService.insertId,
        ...origin,
      }));

      await CarrierServiceCitiesAccountsLink.createMany(origins, tx);
    }

    if (days.length > 0) await CarrierServiceDaysDS.createMany(days, tx);

    return insertedService;
  });

  return c.json(
    {
      status: created?.insertId ? "success" : "error",
      data: { id: created?.insertId },
      msg: created?.insertId ? "service created successfully" : "cannot create service",
    },
    201,
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
    await CarrierServiceDS.update(
      {
        name: service.name,
        type: service.type,
        carrier_id,
        carrier_service_id: service_id,
      },
      tx,
    );

    if (service.days) {
      const days = service.days.map((day) => ({ day_name: day, carrier_service_id: service_id }));
      await CarrierServiceDaysDS.deleteByServiceID(service_id, tx);
      await CarrierServiceDaysDS.createMany(days, tx);
    }

    if (service.origins) {
      const origins = service.origins.map((origin: ServiceOrigin) => ({
        carrier_service_id: service_id,
        account_id: origin.account_id,
        city_id: origin.city_id,
        transit_days: origin.transit_days,
        pickup_days: origin.pickup_days,
      }));

      await CarrierServiceCitiesAccountsLink.deleteByServiceID(service_id, tx);
      if (origins.length > 0) await CarrierServiceCitiesAccountsLink.createMany(origins, tx);
    }

    return true;
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

export async function deleteService(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const service_id = Number(c.req.param("service_id"));
  const deleted = await db.transaction(async (tx) => {
    await CarrierServiceDaysDS.deleteByServiceID(service_id, tx);
    await CarrierServiceCitiesAccountsLink.deleteByServiceID(service_id, tx);
    return CarrierServiceDS.delete(
      {
        carrier_id,
        carrier_service_id: service_id,
      },
      tx,
    );
  });
  logger.info(`Deleted service: ${service_id}`);

  return c.json(null, deleted?.affectedRows === 1 ? 204 : 500);
}
