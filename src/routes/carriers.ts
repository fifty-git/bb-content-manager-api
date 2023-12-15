import { Hono } from "hono";
import {
  activateAccount,
  createAccount,
  deactivateAccount,
  deleteAccount,
  getAllAccounts,
  updateAccount,
} from "~/core/application/carrier-accounts";
import {
  activateCarrier,
  createCarrier,
  deactivateCarrier,
  deleteCarrier,
  getAllCarriers,
  getCarrierById,
  updateCarrier,
} from "~/core/application/carriers";
import {
  activateService,
  createService,
  deactivateService,
  deleteService,
  getAllCarrierServices,
  getCarrierServicesById,
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
carriersRouter.delete("/:carrier_id", deleteCarrier);
carriersRouter.delete("/:carrier_id/services/:service_id", deleteService);
carriersRouter.delete("/accounts/:account_id", deleteAccount);
