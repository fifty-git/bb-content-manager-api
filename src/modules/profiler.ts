import { LOG_LEVEL } from "~/modules/env";
import { logger } from "~/modules/logger";

export function profile_execution(fn: any, ...args: any[]) {
  const start_hrtime = process.hrtime();

  const result = fn(...args);

  if (LOG_LEVEL === "debug") {
    const hrtime = process.hrtime(start_hrtime);
    const duration_ms = hrtime[0] * 1000 + hrtime[1] / 1e6;
    const duration_us = duration_ms * 1000;
    logger.debug(`Function ${fn.name} executed in ${duration_ms}ms (${duration_us}us)`);
  }

  return result;
}
