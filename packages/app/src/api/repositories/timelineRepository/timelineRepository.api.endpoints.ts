export const timelineRepositoryEndpoints = () => {
  const BASE_URL = '/objects';

  return {
    base: `${BASE_URL}/:objectId/timeline`
  };
};
