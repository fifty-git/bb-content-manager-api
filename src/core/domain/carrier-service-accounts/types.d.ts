import type { Status } from "../carriers/entity";

export interface CarrierServiceAccount {
  account_id: number;
  name: string;
  number: string;
  status: Status;
}

export interface UpdateCarrierServiceAccount {
  account_id: number;
  name?: string;
  number?: string;
  status?: Status;
}
