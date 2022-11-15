export type PosBusAttributeMessageDataType<T> = {
  attribute_name: string;
  sub_name?: string;
  value?: T;
};
