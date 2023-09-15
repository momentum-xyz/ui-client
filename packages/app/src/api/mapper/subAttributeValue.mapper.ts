import {ObjectAttributeItemResponse} from 'api';

/**
 * Convert key-value pairs to generic type.
 * @param subAttributes key-value pairs.
 * @return {type} Generic type.
 */
export const mapSubAttributeValue = <T>(subAttribute: ObjectAttributeItemResponse): T | null => {
  // TODO: add edge cases if it needs
  if (subAttribute) {
    const values = Object.values(subAttribute);
    if (values.length) {
      return values[0] as never as T;
    }
  }
  return null;
};
