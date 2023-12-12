import { Hono } from "hono";
import {
    activateAccount,
  activateCarrier,
  activateService,
  createAccount,
  createCarrier,
  createService,
  deactivateAccount,
  deactivateCarrier,
  deactivateService,
  deleteAccount,
  deleteCarrier,
  deleteService,
  getAllAccounts,
  getAllCarriers,
  getAllCarrierServices,
  getCarrierById,
  getCarrierServicesById,
  updateAccount,
  updateCarrier,
  updateService,
} from "~/core/application/carriers-service";

export const carriersRouter = new Hono();

carriersRouter.get("/", getAllCarriers);
carriersRouter.get("/accounts", getAllAccounts);
carriersRouter.get("/:carrier_id", getCarrierById);
carriersRouter.get("/:carrier_id/services", getAllCarrierServices);
carriersRouter.get("/:carrier_id/services/:service_id", getCarrierServicesById);
carriersRouter.post("/", createCarrier);
carriersRouter.post("/accounts", createAccount);
carriersRouter.post("/:carrier_id/services", createService);
carriersRouter.put("/:carrier_id", updateCarrier);
carriersRouter.put("/:carrier_id/services/:service_id", updateService);
carriersRouter.put("/:carrier_id/activate", activateCarrier);
carriersRouter.put("/:carrier_id/deactivate", deactivateCarrier);
carriersRouter.put("/:carrier_id/services/:service_id/activate", activateService);
carriersRouter.put("/:carrier_id/services/:service_id/deactivate", deactivateService);
carriersRouter.put("/accounts/:account_id", updateAccount);
carriersRouter.put("/accounts/:account_id/activate", activateAccount);
carriersRouter.put("/accounts/:account_id/deactivate", deactivateAccount);
carriersRouter.post("/:carrier_id/services", createService);
carriersRouter.delete("/:carrier_id", deleteCarrier);
carriersRouter.delete("/:carrier_id/services/:service_id", deleteService);
carriersRouter.delete("/accounts/:account_id", deleteAccount);
carriersRouter.post("/:carrier_id/services", createService);
