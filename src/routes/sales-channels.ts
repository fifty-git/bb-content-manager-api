import { Hono } from "hono";
import { getSalesChannels } from "~/core/application/sales-channels-service";

export const salesChannelsRouter = new Hono();

salesChannelsRouter.get("/", getSalesChannels);
