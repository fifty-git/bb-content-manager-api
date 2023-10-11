import { Status, type Carrier, type NewService, type UpdateCarrier, type UpdateService } from "../domain/carriers/entity";
import type { EnvAPI } from "../domain/types";
import type { Context } from "hono";
import type { SafeParseReturnType } from "zod";
import {
  CreateCarrierSchema,
  CreateServiceSchema,
  UpdateCarrierSchema,
  UpdateServiceSchema,
} from "../domain/carriers/validator/create-carrier";
import { CarriersDS } from "../infrastructure/drizzle/carriers";
import { CarrierServiceDS } from "../infrastructure/drizzle/carrier-services";
import { db } from "~/modules/drizzle";

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
  const composed: Carrier[] = await Promise.all(
    carriers.map(async (carrier) => ({
      ...carrier,
      services: await CarrierServiceDS.getByCarrierID(carrier.carrier_id),
    })),
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
  const composed: Carrier[] = [{ ...carrier[0], services }];

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
  const carrier = await CarrierServiceDS.getByCarrierID(id);

  return c.json(
    {
      status: carrier ? "success" : "error",
      data: carrier,
    },
    200,
  );
}

export async function getCarrierServiceById(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const service_id = Number(c.req.param("service_id"));
  const carrier = await CarrierServiceDS.getByIds(carrier_id, service_id);

  return c.json(
    {
      status: carrier ? "success" : "error",
      data: carrier,
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
  const created = await CarrierServiceDS.create({
    ...(payload.service as NewService),
    carrier_id,
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
  const validator = UpdateServiceSchema.safeParse(payload);
  if (!validator.success) return handleValidationErrors(validator, c);
  const updated = await CarrierServiceDS.update({
    ...(payload.service as UpdateService),
    carrier_id,
    carrier_service_id: service_id,
  });

  return c.json(
    {
      status: updated?.affectedRows === 1 ? "success" : "error",
      data: { carrier_id, service_id },
      msg: updated?.affectedRows === 1 ? "service successfully updated" : "cannot update service",
    },
    200,
  );
}

export async function activateCarrier(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const services = await CarrierServiceDS.getByCarrierID(carrier_id);
  const results = await db.transaction(async (tx) => {
    await CarriersDS.update({
      carrier_id,
      status: Status.ACTIVE,
    }, tx);

    const updates = services.map((service) => CarrierServiceDS.update({
      carrier_id: service.carrier_id,
      carrier_service_id: service.carrier_service_id,
      status: Status.ACTIVE
    }, tx));

    return Promise.all(updates);
  });

  return c.json({
    status: results.map((result) => result.affectedRows).filter((affectedRows) => affectedRows === 1).length === services.length ? "success" : "failed",
    msg: "carrier activated successfully",
    data: {
      carrier_id,
      carrier_service_id: services.map((service) => service.carrier_service_id)
    },
  }, 200);
}

export async function activateService(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const service_id = Number(c.req.param("service_id"));
  const updated = await CarrierServiceDS.update({
    carrier_id,
    carrier_service_id: service_id,
    status: Status.ACTIVE
  });

  return c.json({
    status: updated.affectedRows === 1 ? "success" : "failed",
    msg: "service activated successfully",
    data: { carrier_id, service_id }
  }, 200);
}

export async function deactivateCarrier(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const services = await CarrierServiceDS.getByCarrierID(carrier_id);
  const results = await db.transaction(async (tx) => {
    await CarriersDS.update({
      carrier_id,
      status: Status.INACTIVE,
    }, tx);

    const updates = services.map((service) => CarrierServiceDS.update({
      carrier_id: service.carrier_id,
      carrier_service_id: service.carrier_service_id,
      status: Status.INACTIVE
    }, tx));

    return Promise.all(updates);
  });

  return c.json({
    status: results.map((result) => result.affectedRows).filter((affectedRows) => affectedRows === 1).length === services.length ? "success" : "failed",
    msg: "carrier deactivated successfully",
    data: {
      carrier_id,
      carrier_service_id: services.map((service) => service.carrier_service_id)
    },
  }, 200);
}

export async function deactivateService(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const service_id = Number(c.req.param("service_id"));
  const updated = await CarrierServiceDS.update({
    carrier_id,
    carrier_service_id: service_id,
    status: Status.INACTIVE
  });

  return c.json({
    status: updated.affectedRows === 1 ? "success" : "failed",
    msg: "service deactivated successfully",
    data: { carrier_id, service_id }
  }, 200);
}

export async function deleteCarrier(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  await db.transaction(async (tx) => {
    const services = await CarrierServiceDS.getByCarrierID(carrier_id);
    const deletes = services.map((service) => {
      return CarrierServiceDS.delete({
      carrier_id: service.carrier_id,
      carrier_service_id: service.carrier_service_id
    }, tx)
    });
    await Promise.all(deletes);
    return CarriersDS.delete(carrier_id, tx);
  });

  return c.json(null, 204);
}

export async function deleteService(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const service_id = Number(c.req.param("service_id"));
  await CarrierServiceDS.delete({
    carrier_id,
    carrier_service_id: service_id,
  });

  return c.json(null, 204);
}
