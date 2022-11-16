import {AttributeValueInterface} from './attributeValue.interface';

export interface ApiInterface {
  getSpaceAttributeValue: <T extends AttributeValueInterface>(
    spaceId: string,
    attributeName: string
  ) => Promise<T>;
  setSpaceAttributeValue: <T extends AttributeValueInterface>(
    spaceId: string,
    attributeName: string,
    value: T
  ) => Promise<T>;
  deleteSpaceAttribute: (spaceId: string, attributeName: string) => Promise<null>;

  getSpaceAttributeItem: <T>(
    spaceId: string,
    attributeName: string,
    attributeItemName: string
  ) => Promise<T>;
  setSpaceAttributeItem: <T>(
    spaceId: string,
    attributeName: string,
    attributeItemName: string,
    value: T
  ) => Promise<T>;
  deleteSpaceAttributeItem: (
    spaceId: string,
    attributeName: string,
    attributeItemName: string
  ) => Promise<null>;

  subscribeToTopic: (topic: string) => void;
  unsubscribeFromTopic: (topic: string) => void;

  useAttributeChange: <T extends AttributeValueInterface = AttributeValueInterface>(
    topic: string,
    attributeName: string,
    callback: (value: T) => void
  ) => void;
  useAttributeRemove: (topic: string, attributeName: string, callback: () => void) => void;

  useAttributeItemChange: <T = unknown>(
    topic: string,
    attributeName: string,
    attributeItemName: string,
    callback: (value: T) => void
  ) => void;
  useAttributeItemRemove: (
    topic: string,
    attributeName: string,
    attributeItemName: string,
    callback: () => void
  ) => void;
}
