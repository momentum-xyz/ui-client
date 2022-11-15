import {appVariables} from 'api/constants';

export const spaceAttributesRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/spaces/:spaceId`;

  return {
    attributes: `${BASE_URL}/attributes`,
    attributeItem: `${BASE_URL}/attributes/sub`,
    attributeWithChildren: `${BASE_URL}/attributes-with-children`
  };
};
