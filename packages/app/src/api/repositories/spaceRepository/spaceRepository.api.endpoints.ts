export const spaceRepositoryEndpoints = () => {
  const BASE_URL = '/objects';

  return {
    base: `${BASE_URL}`,
    object: `${BASE_URL}/:objectId`,
    members: `${BASE_URL}/:objectId/members`,
    deleteMember: `${BASE_URL}/:objectId/members/:userId`
  };
};
