import type { UpdateCarrier } from "../domain/carriers/entity";
import type { EnvAPI } from "../domain/types";
import type { Context } from "hono";
import type { SafeParseReturnType } from "zod";
import { db } from "~/modules/drizzle";
import { logger } from "~/modules/logger";
import { Status } from "../domain/carriers/entity";
import { CreateCarrierSchema, UpdateCarrierSchema } from "../domain/carriers/validator/create-carrier";
import { CarrierServiceCitiesAccountsLink } from "../infrastructure/drizzle/carrier-service-cities-accounts-link";
import { CarrierServiceDaysDS } from "../infrastructure/drizzle/carrier-service-days";
import { CarrierServiceDS } from "../infrastructure/drizzle/carrier-services";
import { CarriersDS } from "../infrastructure/drizzle/carriers";

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

export async function getAllCarriers(c: Context<EnvAPI>) {
  const carriers = await CarriersDS.getAll();
  const composed = await Promise.all(
    carriers.map(async (carrier) => {
      const services = await CarrierServiceDS.getByCarrierID(carrier.carrier_id);
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
  const composed = [{ ...carrier, services: composedServices }];

  return c.json(
    {
      status: carrier ? "success" : "error",
      data: composed,
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

export async function deleteCarrier(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const deleted = await db.transaction(async (tx) => {
    const services = await CarrierServiceDS.getByCarrierID(carrier_id);
    await Promise.all(
      services.map(async (service) => {
        await CarrierServiceCitiesAccountsLink.deleteByServiceID(service.carrier_service_id);
        return CarrierServiceDaysDS.deleteByServiceID(service.carrier_service_id, tx);
      }),
    );
    await CarrierServiceDS.deleteByCarrierID(carrier_id, tx);
    return CarriersDS.delete(carrier_id, tx);
  });
  logger.info(`Deleted carrier: ${carrier_id}`);

  return c.json(null, deleted?.affectedRows === 1 ? 204 : 500);
}
