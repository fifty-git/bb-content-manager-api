import type { Days, NewCarrierServiceDay, NewCarrierServiceAccount, NewService, ServiceOrigin, UpdateAccount, UpdateCarrier, UpdateService } from "../domain/carriers/entity";
import type { EnvAPI } from "../domain/types";
import type { Context } from "hono";
import { object, type SafeParseReturnType } from "zod";
import { db } from "~/modules/drizzle";
import { Status } from "../domain/carriers/entity";
import {
  CreateCarrierSchema,
  CreateServiceSchema,
  UpdateCarrierSchema,
  UpdateServiceSchema,
} from "../domain/carriers/validator/create-carrier";
import { CarrierServiceCitiesAccountsLink } from "../infrastructure/drizzle/carrier-service-cities-accounts-link";
import { CarrierServiceDaysDS } from "../infrastructure/drizzle/carrier-service-days";
import { CarrierServiceDS } from "../infrastructure/drizzle/carrier-services";
import { CarriersDS } from "../infrastructure/drizzle/carriers";
import { CarrierServicesAccountsDS } from "../infrastructure/drizzle/carrier-services-accounts";
import { CarrierServiceAccount, UpdateCarrierServiceAccount } from "../domain/carrier-service-accounts/types";
import { CreateAccountSchema } from "../domain/carrier-service-accounts/validator/createAccount";
import { UpdateAccountSchema } from "../domain/carrier-service-accounts/validator/updateAccount";
import { logger } from "~/modules/logger";

function handleValidationErrors(validator: SafeParseReturnType<any, any>, c: any) {
  if (!validator.success) {
    logger.error(validator.error);
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

export async function getAllAccounts(c: Context<EnvAPI>) {
  const accounts = await CarrierServicesAccountsDS.getAllAccounts();
  return c.json({
    status: accounts ? "success" : "error",
    data: accounts,
  }, 200);
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
    const insertedService = await CarrierServiceDS.create(
      {
        ...(payload.service as NewService),
        carrier_id,
      },
      tx,
    );

    const days: NewCarrierServiceDay[] = payload.service.days.map((day: Days) => ({
      carrier_service_id: insertedService.insertId,
      day_name: day,
    }));

    if (payload.service.origins) {
      const origins = payload.service.origins.map((origin: NewCarrierServiceAccount) => ({
        carrier_service_id: insertedService.insertId,
        ...origin,
      }));

      await CarrierServiceCitiesAccountsLink.createMany(origins, tx);
    }

    await CarrierServiceDaysDS.createMany(days, tx);

    return insertedService;
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

export async function createAccount(c: Context<EnvAPI>) {
  const payload = await c.req.json();
  const account = payload.account as CarrierServiceAccount;
  const validator = CreateAccountSchema.safeParse(account);
  if (!validator.success) return handleValidationErrors(validator, c);
  
  const created = await CarrierServicesAccountsDS.create(account);

  return c.json({
    status: created?.insertId ? "success" : "error",
    data: { id: created?.insertId },
    msg: created?.insertId ? "account successfully created" : "cannot create account",
  },
  201);
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

      if (origins.length > 0) {
        await CarrierServiceCitiesAccountsLink.createMany(origins, tx);
      }
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

export async function updateAccount(c: Context<EnvAPI>) {
  const account_id = Number(c.req.param("account_id"));
  const payload = await c.req.json();
  const account: UpdateCarrierServiceAccount = {
    ...payload.account,
    account_id: account_id,
  };

  const validator = UpdateAccountSchema.safeParse(account);
  if (!validator.success) return handleValidationErrors(validator, c);

  const updated = await CarrierServicesAccountsDS.update(account);

  return c.json(
    {
      status: updated ? "success" : "error",
      data: { account_id },
      msg: updated ? "account successfully updated" : "cannot update account",
    },
    201,
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

export async function activateAccount(c: Context<EnvAPI>) {
  const account_id = Number(c.req.param("account_id"));
  const account: UpdateCarrierServiceAccount = {
    account_id,
    status: Status.ACTIVE,
  };

  const validator = UpdateAccountSchema.safeParse(account);
  if (!validator.success) return handleValidationErrors(validator, c);

  const updated = await CarrierServicesAccountsDS.update(account);

  return c.json(
    {
      status: updated ? "success" : "error",
      data: { account_id },
      msg: updated ? "account successfully activated" : "cannot activate account",
    },
    201,
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

export async function deactivateAccount(c: Context<EnvAPI>) {
  const account_id = Number(c.req.param("account_id"));
  const account: UpdateCarrierServiceAccount = {
    account_id,
    status: Status.INACTIVE,
  };

  const validator = UpdateAccountSchema.safeParse(account);
  if (!validator.success) return handleValidationErrors(validator, c);

  const updated = await CarrierServicesAccountsDS.update(account);

  return c.json(
    {
      status: updated ? "success" : "error",
      data: { account_id },
      msg: updated ? "account successfully deactivated" : "cannot deactivate account",
    },
    201,
  );

}

export async function deleteCarrier(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const deleted = await db.transaction(async (tx) => {
    const services = await CarrierServiceDS.getByCarrierID(carrier_id);
    await Promise.all(services.map((service) => CarrierServiceDaysDS.deleteByServiceID(service.carrier_service_id, tx)));
    await CarrierServiceDS.deleteByCarrierID(carrier_id, tx);
    return CarriersDS.delete(carrier_id, tx);
  });

  return c.json(null, deleted?.affectedRows === 1 ? 204 : 500);
}

export async function deleteService(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const service_id = Number(c.req.param("service_id"));
  const deleted = await db.transaction(async (tx) => {
    await CarrierServiceDaysDS.deleteByServiceID(service_id, tx);
    return CarrierServiceDS.delete(
      {
        carrier_id,
        carrier_service_id: service_id,
      },
      tx,
    );
  });

  return c.json(null, deleted?.affectedRows === 1 ? 204 : 500);
}

export async function deleteAccount(c: Context<EnvAPI>) {
  const account_id = Number(c.req.param("account_id"));

  const deleted = await db.transaction(async tx => {
    await CarrierServiceCitiesAccountsLink.deleteByAccountID(account_id, tx);
    return CarrierServicesAccountsDS.delete(account_id, tx);
  });

  return c.json(null, deleted?.affectedRows === 1 ? 204 : 500);
}
