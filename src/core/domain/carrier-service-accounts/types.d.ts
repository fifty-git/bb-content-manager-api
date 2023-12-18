import type { Status } from "../carriers/entity";

export interface CarrierServiceAccount {
  account_id: number;
  account_name: string;
  account_number: string;
  status: Status;
}

export interface UpdateCarrierServiceAccount {
  account_id: number;
  account_name?: string;
  account_number?: string;
  status?: Status;
}
