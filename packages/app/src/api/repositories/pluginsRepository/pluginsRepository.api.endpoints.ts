export const pluginsRepositoryEndpoints = () => {
  const BASE_URL = '/plugins';

  return {
    list: `${BASE_URL}`,
    metadata: `${BASE_URL}/meta`,
    options: `${BASE_URL}/options`,
    search: `${BASE_URL}/search`
  };
};
