import { logger } from "~/modules/logger";
import { Carrier, NewCarrier, Service, UpdateService } from "../domain/carriers/entity";
import { CarriersDS } from "../infrastructure/drizzle/carriers";
import { Context } from "hono";
import { EnvAPI } from "../domain/types";
import { CarrierServiceDS } from "../infrastructure/drizzle/carrierServices";

async function asyncErrorWrapper<T>(fn: Function) {
  try {
    const response = await fn();
    return response as T;
  } catch(error) {
    logger.error(error);
  }
}

export async function getAllCarriers(c: Context<EnvAPI>) {
  const carriers = await asyncErrorWrapper<Carrier>(() => CarriersDS.getAll());
  c.status(carriers ? 200 : 404);

  return c.json({
    status: carriers ? "successs" : "error",
    data: carriers,
    msg: carriers ? "success retrieve" : "there are no carriers registered"
  });
}

export async function getCarrierById(c: Context<EnvAPI>) {
  const id = Number(c.req.param("carrier_id"));
  const carrier = await asyncErrorWrapper<Carrier>(() => CarriersDS.get(id));
  c.status(carrier ? 200 : 404);

  return c.json({
    status: carrier ? "successs" : "error",
    data: carrier,
    msg: carrier ? "success retrieve" : "carrier not found"
  });
}

export async function getAllCarrierServices(c: Context<EnvAPI>) {
  const id = Number(c.req.param("carrier_id"));
  const carrier = await asyncErrorWrapper<Service>(() => CarrierServiceDS.getByCarrier(id));
  c.status(carrier ? 200 : 404);

  return c.json({
    status: carrier ? "successs" : "error",
    data: carrier,
    msg: carrier ? "success retrieve" : "carrier services not found"
  });
}

export async function getCarrierServiceById(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const service_id = Number(c.req.param("service_id"));
  const carrier = await asyncErrorWrapper<Service>(() => CarrierServiceDS.getByIds(carrier_id, service_id));
  c.status(carrier ? 200 : 404);

  return c.json({
    status: carrier ? "successs" : "error",
    data: carrier,
    msg: carrier ? "success retrieve" : "carrier service not found"
  });
}

export async function createCarrier(c: Context<EnvAPI>) {
  const { carrier }: { carrier: Carrier } = await c.req.json();
  const created = await CarriersDS.create(carrier);
  c.status(created?.insertId ? 200 : 404);

  return c.json({
    status: created?.insertId ? "successs" : "error",
    data: {
      id: created?.insertId
    },
    msg: created?.insertId ? "carrier successfully created" : "cannot create carrier"
  });
}

export async function createService(c: Context<EnvAPI>) {
  const { service }: { service: Service } = await c.req.json();
  const created = await CarrierServiceDS.create(service);
  c.status(created?.insertId ? 200 : 404);

  return c.json({
    status: created?.insertId ? "successs" : "error",
    data: {
      id: created?.insertId
    },
    msg: created?.insertId ? "service successfully retrieved" : "cannot create service"
  });
}

export async function updateService(c: Context<EnvAPI>) {
  const carrier_id = Number(c.req.param("carrier_id"));
  const service_id = Number(c.req.param("service_id"));
  const { service }: { service: UpdateService } = await c.req.json();
  const updated = (carrier_id && service_id) ? await CarrierServiceDS.update({
    carrier_id,
    carrier_service_id: service_id,
    ...service
  }) : undefined;
  console.log(updated);
  // c.status(created?.insertId ? 200 : 404);

  return c.json({
    // status: created?.insertId ? "successs" : "error",
    // data: {
    //   id: created?.insertId
    // },
    // msg: created?.insertId ? "service successfully retrieved" : "cannot create service"
  });
}

