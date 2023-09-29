import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { MySqlTransaction } from "drizzle-orm/mysql-core";
import type { MySql2PreparedQueryHKT, MySql2QueryResultHKT } from "drizzle-orm/mysql2";
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

export type Transaction = MySqlTransaction<
  MySql2QueryResultHKT,
  MySql2PreparedQueryHKT,
  Record<string, never>,
  ExtractTablesWithRelations<Record<string, never>>
>;

