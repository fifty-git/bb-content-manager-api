import { Hono } from "hono";
import {
  activateCarrier,
  activateService,
  createCarrier,
  createCarrierAccount,
  createService,
  deactivateCarrier,
  deactivateService,
  deleteCarrier,
  deleteService,
  getAllCarriers,
  getAllCarrierServices,
  getCarrierById,
  getCarrierServicesById,
  updateCarrier,
  updateService,
} from "~/core/application/carriers-service";

export const carriersRouter = new Hono();

carriersRouter.get("/", getAllCarriers);
carriersRouter.get("/:carrier_id", getCarrierById);
carriersRouter.get("/:carrier_id/services", getAllCarrierServices);
carriersRouter.get("/:carrier_id/services/:service_id", getCarrierServicesById);
carriersRouter.post("/", createCarrier);
carriersRouter.post("/accounts", createCarrierAccount);
carriersRouter.post("/:carrier_id/services", createService);
carriersRouter.put("/:carrier_id", updateCarrier);
carriersRouter.put("/:carrier_id/services/:service_id", updateService);
carriersRouter.put("/:carrier_id/activate", activateCarrier);
carriersRouter.put("/:carrier_id/deactivate", deactivateCarrier);
carriersRouter.put("/:carrier_id/services/:service_id/activate", activateService);
carriersRouter.put("/:carrier_id/services/:service_id/deactivate", deactivateService);
carriersRouter.delete("/:carrier_id", deleteCarrier);
carriersRouter.delete("/:carrier_id/services/:service_id", deleteService);
