import type { CarrierServiceAccount, UpdateCarrierServiceAccount } from "../domain/carrier-service-accounts/types";
import type { EnvAPI } from "../domain/types";
import type { Context } from "hono";
import type { SafeParseReturnType } from "zod";
import { db } from "~/modules/drizzle";
import { logger } from "~/modules/logger";
import { CreateAccountSchema } from "../domain/carrier-service-accounts/validator/createAccount";
import { UpdateAccountSchema } from "../domain/carrier-service-accounts/validator/updateAccount";
import { Status } from "../domain/carriers/entity";
import { CarrierServiceCitiesAccountsLink } from "../infrastructure/drizzle/carrier-service-cities-accounts-link";
import { CarrierServicesAccountsDS } from "../infrastructure/drizzle/carrier-services-accounts";

function handleValidationErrors(validator: SafeParseReturnType<any, any>, c: any) {
  if (!validator.success) {
    logger.error(validator.error);
    return c.json(
      {
        status: "error",
        msg: `${validator.error.errors[0].message} (${validator.error.errors[0].path.join(".")})`,
      },
      400,
    );
  }
}

export async function getAllAccounts(c: Context<EnvAPI>) {
  const accounts = await CarrierServicesAccountsDS.getAllAccounts();
  return c.json(
    {
      status: accounts ? "success" : "error",
      data: accounts,
    },
    200,
  );
}

export async function createAccount(c: Context<EnvAPI>) {
  const payload = await c.req.json();
  const account = payload.account as CarrierServiceAccount;
  const validator = CreateAccountSchema.safeParse(account);
  if (!validator.success) return handleValidationErrors(validator, c);

  const created = await CarrierServicesAccountsDS.create(account);

  return c.json(
    {
      status: created?.insertId ? "success" : "error",
      data: { id: created?.insertId },
      msg: created?.insertId ? "account successfully created" : "cannot create account",
    },
    201,
  );
}

export async function updateAccount(c: Context<EnvAPI>) {
  const account_id = Number(c.req.param("account_id"));
  const payload = await c.req.json();
  const account: UpdateCarrierServiceAccount = {
    ...payload.account,
    account_id,
  };

  const validator = UpdateAccountSchema.safeParse(account);
  if (!validator.success) return handleValidationErrors(validator, c);

  const updated = await CarrierServicesAccountsDS.update(account);

  return c.json(
    {
      status: updated ? "success" : "error",
      data: { account_id },
      msg: updated ? "account successfully updated" : "cannot update account",
    },
    201,
  );
}

export async function activateAccount(c: Context<EnvAPI>) {
  const account_id = Number(c.req.param("account_id"));
  const account: UpdateCarrierServiceAccount = {
    account_id,
    status: Status.ACTIVE,
  };

  const validator = UpdateAccountSchema.safeParse(account);
  if (!validator.success) return handleValidationErrors(validator, c);

  const updated = await CarrierServicesAccountsDS.update(account);

  return c.json(
    {
      status: updated ? "success" : "error",
      data: { account_id },
      msg: updated ? "account successfully activated" : "cannot activate account",
    },
    201,
  );
}

export async function deactivateAccount(c: Context<EnvAPI>) {
  const account_id = Number(c.req.param("account_id"));
  const account: UpdateCarrierServiceAccount = {
    account_id,
    status: Status.INACTIVE,
  };

  const validator = UpdateAccountSchema.safeParse(account);
  if (!validator.success) return handleValidationErrors(validator, c);

  const updated = await CarrierServicesAccountsDS.update(account);

  return c.json(
    {
      status: updated ? "success" : "error",
      data: { account_id },
      msg: updated ? "account successfully deactivated" : "cannot deactivate account",
    },
    201,
  );
}

export async function deleteAccount(c: Context<EnvAPI>) {
  const account_id = Number(c.req.param("account_id"));

  const deleted = await db.transaction(async (tx) => {
    await CarrierServiceCitiesAccountsLink.deleteByAccountID(account_id, tx);
    return CarrierServicesAccountsDS.delete(account_id, tx);
  });
  logger.info(`Deleted account: ${account_id}`);

  return c.json(null, deleted?.affectedRows === 1 ? 204 : 500);
}
