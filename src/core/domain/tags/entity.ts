export enum TagType {
  product = "product",
  order = "order",
  purchase_order = "purchase-order",
  searchable = "searchable",
}

export interface NewTag {
  name: string;
  type: TagType;
}
