import { logger } from "~/modules/logger";
import {
  Carrier,
  NewService,
  Service,
  UpdateCarrier,
  UpdateService,
} from "../domain/carriers/entity";
import { CarriersDS } from "../infrastructure/drizzle/carriers";
import { Context } from "hono";
import { EnvAPI } from "../domain/types";
import { CarrierServiceDS } from "../infrastructure/drizzle/carrierServices";
import {
  CreateCarrierSchema,
  CreateServiceSchema,
  UpdateCarrierSchema,
  UpdateServiceSchema,
} from "../domain/carriers/validator/create-carrier";
import { SafeParseReturnType } from "zod";

async function asyncErrorWrapper<T>(fn: Function) {
  try {
    const response = await fn();
    return response as T;
  } catch (error) {
    logger.error(error);
  }
}

function handleValidationErrors(
  validator: SafeParseReturnType<any, any>,
  c: any,
) {
  if (!validator.success) {
    c.status(400);
    return c.json({
      status: "error",
      data: validator.error.errors,
      msg: "incorrect payload",
    });
  }
}

export async function getAllCarriers(c: Context<EnvAPI>) {
  const carriers = await asyncErrorWrapper<Carrier>(() => CarriersDS.getAll());
  c.status(carriers ? 200 : 404);

  return c.json({
    status: carriers ? "successs" : "error",
    data: carriers,
    msg: carriers ? "success retrieve" : "there are no carriers registered",
  });
}

export async function getCarrierById(c: Context<EnvAPI>) {
  const id = Number(c.req.param("carrier_id"));
  const carrier = await asyncErrorWrapper<Carrier>(() => CarriersDS.get(id));
  c.status(carrier ? 200 : 404);

  return c.json({
    status: carrier ? "successs" : "error",
    data: carrier,
    msg: carrier ? "success retrieve" : "carrier not found",
  });
}

export async function getAllCarrierServices(c: Context<EnvAPI>) {
  const id = Number(c.req.param("carrier_id"));
  const carrier = await asyncErrorWrapper<Service>(() =>
    CarrierServiceDS.getByCarrier(id)
  );
  c.status(carrier ? 200 : 404);

  return c.json({
    status: carrier ? "successs" : "error",
    data: carrier,
    msg: carrier ? "success retrieve" : "carrier services not found",
  });
}

export async function getCarrierServiceById(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const service_id = Number(c.req.param("service_id"));
  const carrier = await asyncErrorWrapper<Service>(() =>
    CarrierServiceDS.getByIds(carrier_id, service_id)
  );
  c.status(carrier ? 200 : 404);

  return c.json({
    status: carrier ? "successs" : "error",
    data: carrier,
    msg: carrier ? "success retrieve" : "carrier service not found",
  });
}

export async function createCarrier(c: Context<EnvAPI>) {
  const payload = await c.req.json();
  const validator = CreateCarrierSchema.safeParse(payload);
  if (!validator.success) return handleValidationErrors(validator, c);
  const created = await CarriersDS.create(payload.carrier);
  c.status(created?.insertId ? 200 : 404);

  return c.json({
    status: created?.insertId ? "successs" : "error",
    data: {
      id: created?.insertId,
    },
    msg: created?.insertId
      ? "carrier successfully created"
      : "cannot create carrier",
  });
}

export async function createService(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const payload = await c.req.json();
  const validator = CreateServiceSchema.safeParse(payload);
  if (!validator.success) return handleValidationErrors(validator, c);
  const created = await CarrierServiceDS.create({
    ...payload.service as NewService,
    carrier_id,
  });
  c.status(created?.insertId ? 200 : 404);

  return c.json({
    status: created?.insertId ? "successs" : "error",
    data: {
      id: created?.insertId,
    },
    msg: created?.insertId
      ? "service successfully created"
      : "cannot create service",
  });
}

export async function updateCarrier(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const payload: { carrier: UpdateCarrier } = await c.req.json();
  const validator = UpdateCarrierSchema.safeParse(payload);
  if (!validator.success) return handleValidationErrors(validator, c);
  const updated = await CarriersDS.update({
    ...payload.carrier,
    carrier_id,
  });
  c.status(updated?.affectedRows === 1 ? 200 : 404);

  return c.json({
    status: updated?.affectedRows === 1 ? "successs" : "error",
    data: { carrier_id },
    msg: updated?.affectedRows === 1
      ? "service successfully updated"
      : "cannot update service",
  });
}

export async function updateService(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const service_id = Number(c.req.param("service_id"));
  const payload = await c.req.json();
  const validator = UpdateServiceSchema.safeParse(payload);
  if (!validator.success) return handleValidationErrors(validator, c);
  const updated = await CarrierServiceDS.update({
    ...payload.service as UpdateService,
    carrier_id,
    carrier_service_id: service_id,
  });
  c.status(updated?.affectedRows === 1 ? 200 : 404);

  return c.json({
    status: updated?.affectedRows === 1 ? "successs" : "error",
    data: { carrier_id, service_id },
    msg: updated?.affectedRows === 1
      ? "service successfully updated"
      : "cannot update service",
  });
}

export async function deleteCarrier(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const deleted = await CarriersDS.delete(carrier_id);
  c.status(deleted?.affectedRows === 1 ? 200 : 404);

  return c.json({
    status: deleted?.affectedRows === 1 ? "successs" : "error",
    data: { carrier_id },
    msg: deleted?.affectedRows === 1
      ? "carrier successfully deleted"
      : "cannot delete carrier",
  });
}

export async function deleteService(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const service_id = Number(c.req.param("service_id"));
  const deleted = await CarrierServiceDS.delete({
    carrier_id,
    carrier_service_id: service_id,
  });
  c.status(deleted?.affectedRows === 1 ? 200 : 404);

  return c.json({
    status: deleted?.affectedRows === 1 ? "successs" : "error",
    data: { carrier_id, service_id },
    msg: deleted?.affectedRows === 1
      ? "carrier successfully deleted"
      : "cannot delete carrier",
  });
}
