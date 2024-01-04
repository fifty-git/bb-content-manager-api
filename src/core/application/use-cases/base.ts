import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";

export abstract class BaseUseCase {
  protected abstract status_code: number;
  protected abstract msg: string;
  abstract getData(c: Context<EnvAPI>): Promise<any>;
  protected abstract validate(data: any): Promise<undefined | string>;
  protected abstract process(): Promise<void>;

  async run(c: Context<EnvAPI>) {
    const _data = await this.getData(c);
    const error = await this.validate(_data);
    if (error) return c.json({ error }, 400);
    await this.process();
    return c.json({ msg: this.msg }, this.status_code);
  }
}
