export const spaceAttributesRepositoryEndpoints = () => {
  const BASE_URL = '/spaces/:spaceId/attributes';

  return {
    attributes: `${BASE_URL}`,
    attributeItem: `${BASE_URL}/sub`
  };
};
