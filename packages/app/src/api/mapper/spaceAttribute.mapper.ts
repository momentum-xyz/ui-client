import {GetSpaceSubAttributeResponse} from 'api/index';

/**
 * Convert key-value pairs to generic type.
 * @param subAttributes key-value pairs.
 * @return {type} Generic type.
 */
export const mapSubAttributes = <T>(subAttributes: GetSpaceSubAttributeResponse): T => {
  // TODO: add edge cases if it needs
  return subAttributes as T;
};
