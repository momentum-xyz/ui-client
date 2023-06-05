export const assets3dRepositoryEndpoints = () => {
  const BASE_URL = '/assets-3d';

  return {
    base: BASE_URL,
    upload: `${BASE_URL}/upload`,
    patchMeta: `${BASE_URL}/:assetId`
  };
};
