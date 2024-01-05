import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";

export abstract class BaseUseCase {
  protected abstract status_code: number;
  protected abstract msg: string;
  protected abstract validateData(c: Context<EnvAPI>): Promise<any>;
  protected abstract process(): Promise<void>;

  async run(c: Context<EnvAPI>) {
    // Getting and validating the data
    c.var.log.info(`[${c.req.method}] ${c.req.url}`);
    const error = await this.validateData(c);
    if (error) {
      c.var.log.error({ error });
      return c.json({ error }, 400);
    }

    // Running the process
    await this.process();

    // Returning response
    c.var.log.info({ status: "success", msg: this.msg, status_code: this.status_code });
    return c.json({ status: "success", msg: this.msg }, this.status_code);
  }
}

export abstract class BaseDataAccess {
  protected abstract status_code: number;
  protected abstract msg?: string;
  protected abstract data: any;
  protected abstract validateData(c: Context<EnvAPI>): Promise<any>;
  protected abstract process(): Promise<void>;

  async run(c: Context<EnvAPI>) {
    // Getting and validating the data
    c.var.log.info(`[${c.req.method}] ${c.req.url}`);
    const error = await this.validateData(c);
    if (error) {
      c.var.log.error({ error });
      return c.json({ error }, 400);
    }

    // Running the process
    await this.process();

    // Returning response
    return c.json({ status: "success", msg: this.msg, data: this.data }, this.status_code);
  }
}