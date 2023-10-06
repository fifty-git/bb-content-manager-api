import { Hono } from "hono";
import {
  createCarrier,
  createService,
  deleteCarrier,
  deleteService,
  getAllCarriers,
  getAllCarrierServices,
  getCarrierById,
  getCarrierServiceById,
  updateCarrier,
  updateService,
} from "~/core/application/carriers-service";

export const carriersRouter = new Hono();

carriersRouter.get("/", getAllCarriers);
carriersRouter.get("/:carrier_id", getCarrierById);
carriersRouter.get("/:carrier_id/services", getAllCarrierServices);
carriersRouter.get("/:carrier_id/services/:service_id", getCarrierServiceById);
carriersRouter.post("/", createCarrier);
carriersRouter.post("/:carrier_id/services", createService);
carriersRouter.put("/:carrier_id", updateCarrier);
carriersRouter.put("/:carrier_id/services/:service_id", updateService);
carriersRouter.delete("/:carrier_id", deleteCarrier);
carriersRouter.delete("/:carrier_id/services/:service_id", deleteService);
