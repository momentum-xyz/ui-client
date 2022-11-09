import {AttributeValueInterface} from './attributeValue.interface';

export interface APIInterface {
  getSpaceAttributeValue: <T extends AttributeValueInterface = AttributeValueInterface>(
    spaceId: string,
    attributeName: string
  ) => Promise<T>;
  setSpaceAttributeValue: <T extends AttributeValueInterface = AttributeValueInterface>(
    spaceId: string,
    attributeName: string,
    value: T
  ) => Promise<T>;
  deleteSpaceAttribute: (spaceId: string, attributeName: string) => Promise<null>;

  getSpaceAttributeValueSubValue: <T>(
    spaceId: string,
    attributeName: string,
    key: string
  ) => Promise<T>;
  setSpaceAttributeValueSubValue: <T>(
    spaceId: string,
    attributeName: string,
    key: string,
    value: T
  ) => Promise<T>;
  deleteSpaceAttributeValueSubValue: (
    spaceId: string,
    attributeName: string,
    key: string
  ) => Promise<null>;

  subscribeToTopic: (topic: string) => Promise<void>;

  onAttributeChange: (
    callback: <T extends AttributeValueInterface = AttributeValueInterface>(
      attributeName: string,
      value: T
    ) => void
  ) => void;
  onAttributeRemove: (callback: (attributeName: string) => void) => void;

  onAttributeValueSubValueChange: (
    callback: <T extends AttributeValueInterface = AttributeValueInterface>(
      attributeName: string,
      key: string,
      value: T
    ) => void
  ) => void;
  onAttributeValueSubValueRemove: (callback: (attributeName: string, key: string) => void) => void;
}
