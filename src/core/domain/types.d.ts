import type { Env } from "hono/dist/types/types";
import type { Logger } from "pino";

export interface UserSession {
  user_id: number;
  firstname: string;
  lastname: string;
  roles: string[];
}
export interface EnvAPI extends Env {
  Variables: {
    id: string;
    log: Logger;
    jwtPayload: UserSession;
  };
}
