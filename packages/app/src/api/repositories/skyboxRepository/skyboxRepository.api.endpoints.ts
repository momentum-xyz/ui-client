export const skyboxRepositoryEndpoints = () => {
  const BASE_URL = '/skybox';

  return {
    base: BASE_URL,
    skybox: `${BASE_URL}/:skyboxId`,
    styles: `${BASE_URL}/styles`,
    generate: `${BASE_URL}/generate`
  };
};
