export const objectAttributesRepositoryEndpoints = () => {
  const BASE_URL = '/objects/:spaceId/attributes';

  return {
    attributes: `${BASE_URL}`,
    attributeItem: `${BASE_URL}/sub`
  };
};
