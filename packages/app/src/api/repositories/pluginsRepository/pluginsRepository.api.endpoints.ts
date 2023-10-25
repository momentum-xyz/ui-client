export const pluginsRepositoryEndpoints = () => {
  const BASE_URL = '/plugin';

  return {
    list: `${BASE_URL}`,
    metadata: `${BASE_URL}/meta`,
    options: `${BASE_URL}/options`,
    search: `${BASE_URL}/search`
  };
};
