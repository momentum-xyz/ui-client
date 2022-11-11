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

  subscribeToTopic: (topic: string) => Promise<void>;

  onAttributeChange: (
    callback: <T extends AttributeValueInterface = AttributeValueInterface>(
      attributeName: string,
      value: T
    ) => void
  ) => void;
  onAttributeRemove: (callback: (attributeName: string) => void) => void;

  onAttributeItemChange: (
    callback: <T extends AttributeValueInterface>(
      attributeName: string,
      key: string,
      value: T
    ) => void
  ) => void;
  onAttributeItemRemove: (callback: (attributeName: string, key: string) => void) => void;
}
