export const aiImagesRepositoryEndpoints = () => {
  const BASE_URL = '/leonardo';

  return {
    generate: `${BASE_URL}/generate`,
    fetch: `${BASE_URL}/generate/:leonardoId`
  };
};
