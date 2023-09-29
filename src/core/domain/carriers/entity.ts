export enum ServiceType {
  DOM = "domestic",
  INT = "international",
}

export interface Service {
  carrier_service_id: number;
  carrier_id: number;
  code: string;
  name: string;
  type: ServiceType;
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
}

export interface NewCarrier {
  name: string;
  code: string;
  account_number: string;
  active?: number;
}

export interface UpdateCarrier {
  carrier_id: number;
  name?: string;
  code?: string;
  account_number?: string;
}
