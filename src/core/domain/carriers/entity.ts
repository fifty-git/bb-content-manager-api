export enum ServiceType {
  DOM = "domestic",
  INT = "international",
}

export enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

type NumericRange<Limit extends number, Result extends Array<unknown> = [1]> = Result["length"] extends Limit
  ? Result
  : NumericRange<Limit, [...Result, Result["length"]]>;

export type TransitDays = NumericRange<128>[number];

export interface Service {
  carrier_service_id: number;
  carrier_id: number;
  code: string;
  name: string;
  type: ServiceType;
  transit_days: TransitDays;
  status: Status;
}

export interface NewService {
  code: string;
  name: string;
  transit_days: TransitDays;
  type?: ServiceType;
  carrier_id: number;
}

export interface UpdateService {
  carrier_service_id: number;
  carrier_id: number;
  code?: string;
  name?: string;
  type?: ServiceType;
  status?: Status;
}

export interface DeleteService {
  carrier_id: number;
  carrier_service_id: number;
}

export interface Carrier {
  carrier_id: number;
  name: string;
  code: string;
  account_number: string;
  services?: Service[];
  status: Status;
}

export interface NewCarrier {
  name: string;
  code: string;
  account_number: string;
}

export interface UpdateCarrier {
  carrier_id: number;
  name?: string;
  code?: string;
  account_number?: string;
  status?: Status;
}
