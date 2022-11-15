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

  getSpaceAttributeItem: <T>(spaceId: string, attributeName: string, key: string) => Promise<T>;
  setSpaceAttributeItem: <T>(
    spaceId: string,
    attributeName: string,
    key: string,
    value: T
  ) => Promise<T>;
  deleteSpaceAttributeItem: (spaceId: string, attributeName: string, key: string) => Promise<null>;

  subscribeToTopic: (topic: string) => void;
  unsubscribeFromTopic: (topic: string) => void;

  useAttributeChange: (
    topic: string,
    attributeName: string,
    callback: <T extends AttributeValueInterface = AttributeValueInterface>(value: T) => void
  ) => void;
  useAttributeRemove: (topic: string, attributeName: string, callback: () => void) => void;

  useAttributeItemChange: (
    topic: string,
    attributeName: string,
    key: string,
    callback: <T>(value: T) => void
  ) => void;
  useAttributeItemRemove: (
    topic: string,
    attributeName: string,
    key: string,
    callback: () => void
  ) => void;
}
