export enum ServiceType {
  DOM = "domestic",
  INT = "international",
}

export enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum Days {
  MON = "mon",
  TUE = "tue",
  WED = "wed",
  THU = "thu",
  FRI = "fri",
  SAT = "sat",
  SUN = "sun",
}

export interface NewCarrierServiceCity {
  carrier_service_id: number;
  city_id: number;
  city_name: string;
  transit_days: number;
}

export interface NewCarrierServiceDay {
  carrier_service_id: number;
  day_name: Days;
}

export interface Service {
  carrier_service_id: number;
  carrier_id: number;
  code: string;
  name: string;
  type: ServiceType;
  status: Status;
}

export interface NewService {
  code: string;
  name: string;
  type?: ServiceType;
  carrier_id: number;
}

export interface UpdateService {
  carrier_service_id: number;
  carrier_id: number;
  code?: string;
  name?: string;
  type?: ServiceType;
  days?: Days[];
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
