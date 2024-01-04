import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";

export abstract class BaseUseCase {
  protected abstract status_code: number;
  protected abstract msg: string;
  protected abstract getData(c: Context<EnvAPI>): Promise<any>;
  protected abstract validate(data: any): Promise<undefined | string>;
  protected abstract process(): Promise<void>;

  async run(c: Context<EnvAPI>) {
    // Getting the data
    c.var.log.info(`[${c.req.method}] ${c.req.url}`);
    const _data = await this.getData(c);
    c.var.log.info(_data, "Received:");

    // Validating the data
    const error = await this.validate(_data);
    if (error) {
      c.var.log.error({ error });
      return c.json({ error }, 400);
    }

    // Running the process
    await this.process();

    // Returning response
    c.var.log.info({ msg: this.msg, status_code: this.status_code });
    return c.json({ msg: this.msg }, this.status_code);
  }
}
