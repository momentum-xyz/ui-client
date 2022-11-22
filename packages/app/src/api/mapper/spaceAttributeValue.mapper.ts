import {SpaceAttributeItemResponse} from 'api';

/**
 * Convert key-value pairs to generic type.
 * @param subAttributes key-value pairs.
 * @return {type} Generic type.
 */
export const mapSpaceAttributeValues = <T>(subAttributes: SpaceAttributeItemResponse): Array<T> => {
  // TODO: add edge cases if it needs
  return Object.values(subAttributes) as never as Array<T>;
};
