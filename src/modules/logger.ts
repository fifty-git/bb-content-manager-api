import type { EnvAPI } from "~/core/domain/types";
import type { Context, Next } from "hono";
import type { LoggerOptions } from "pino";
import { customAlphabet } from "nanoid";
import { pino } from "pino";
import { LOG_LEVEL } from "./env";
const nanoid = customAlphabet("1234567890abcdef", 10);

const config: LoggerOptions = {
  level: LOG_LEVEL,
  formatters: {
    bindings: () => {
      return {};
    },
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};

export async function uuid(c: Context<EnvAPI>, next: Next) {
  c.set("id", nanoid());
  await next();
}

export const logger = pino(config);

export async function bindLogger(c: Context<EnvAPI>, next: Next) {
  c.set("log", logger.child({ uuid: c.var.id }));
  await next();
}
