import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { logger } from "~/modules/logger";

const ALLOWED_ERRORS: Record<number, string> = { 302: "Redirected", 400: "Bad Request", 401: "Unauthorized", 404: "Not Found" };

export class CustomError extends Error {
  code: number;
  tag: string;

  constructor(message: string, code: number, tag: string) {
    super(message);
    this.code = code;
    this.name = this.constructor.name;
    this.tag = tag;
  }
}

export class NotFoundError extends CustomError {
  constructor(message = "Not Found", tag = "untagged") {
    super(message, 404, tag);
  }
}

export class ValidationError extends CustomError {
  constructor(message = "Validation Error", tag = "untagged") {
    super(message, 400, tag);
  }
}

export function handleErrors(err: Error, c: Context<EnvAPI>) {
  if (err instanceof CustomError) {
    logger.error({ error: err.message, stack: err.stack, msg: err.name, tag: err.tag });
    return c.json({ err: err.message }, err.code);
  }

  logger.error(err);
  const code = (err as any).status as number;

  if (code in ALLOWED_ERRORS) return c.json({ err: ALLOWED_ERRORS[code] }, code);
  return c.json({ err: "Internal Server Error" }, 500);
}
