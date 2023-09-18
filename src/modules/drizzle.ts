import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { DATABASE_URL, NODE_ENV } from "~/modules/env";
import { logger } from "./logger";

function registerService<T>(name: string, fn: () => T): T {
  if (NODE_ENV === "development") {
    if (!(name in (global as any))) (global as any)[name] = fn();
    return (global as any)[name];
  }
  return fn();
}

export const db = registerService("db", () => {
  const pool = mysql.createPool({
    uri: DATABASE_URL,
    connectionLimit: 5,
    idleTimeout: 60,
  });
  pool.on("acquire", function (connection) {
    logger.debug(`Connection ${connection.threadId} acquired`);
  });

  pool.on("release", function (connection) {
    logger.debug(`Connection ${connection.threadId} released`);
  });
  return drizzle(pool);
});
