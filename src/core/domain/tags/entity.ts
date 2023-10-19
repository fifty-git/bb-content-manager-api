export enum TagType {
  product = "product",
  order = "order",
  purchase_order = "purchase-order",
}

export interface NewTag {
  name: string;
  type: TagType;
  searchable: boolean;
}
