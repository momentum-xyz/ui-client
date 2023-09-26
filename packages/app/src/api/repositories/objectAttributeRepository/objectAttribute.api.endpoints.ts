export const objectAttributesRepositoryEndpoints = () => {
  const BASE_URL = '/objects/:objectId/attributes';

  return {
    attributes: `${BASE_URL}`,
    attributeItem: `${BASE_URL}/sub`
  };
};
