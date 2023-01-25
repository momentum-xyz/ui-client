export const assets3dRepositoryEndpoints = () => {
  const BASE_URL = '/assets-3d/:worldId';

  return {
    base: BASE_URL,
    upload: `${BASE_URL}/upload`
  };
};
