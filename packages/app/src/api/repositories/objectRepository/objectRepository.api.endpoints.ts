export const objectRepositoryEndpoints = () => {
  const BASE_URL = '/objects';

  return {
    base: `${BASE_URL}`,
    object: `${BASE_URL}/:objectId`,
    clone: `${BASE_URL}/:objectId/clone`,
    members: `${BASE_URL}/:objectId/members`,
    tree: `${BASE_URL}/:objectId/tree`,
    deleteMember: `${BASE_URL}/:objectId/members/:userId`,
    claimAndCustomize: `${BASE_URL}/:objectId/claim-and-customise`,
    cleanCustomization: `${BASE_URL}/:objectId/unclaim-and-clear-customisation`,
    spawnByUser: `${BASE_URL}/:objectId/spawn-by-user`
  };
};
