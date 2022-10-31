import {SpaceSubAttributeResponse} from 'api';

/**
 * Convert key-value pairs to generic type.
 * @param subAttributes key-value pairs.
 * @return {type} Generic type.
 */
export const mapSpaceSubAttributes = <T>(subAttributes: SpaceSubAttributeResponse): T => {
  // TODO: add edge cases if it needs
  return subAttributes as never as T;
};

export const mapSubAttributeValue = <T>(subAttribute: SpaceSubAttributeResponse): T => {
  // TODO: add edge cases if it needs
  return Object.values(subAttribute)[0] as never as T;
};
