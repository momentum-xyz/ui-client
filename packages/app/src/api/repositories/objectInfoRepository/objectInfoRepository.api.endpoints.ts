export const objectInfoRepository = () => {
  const BASE_URL = '/objects';

  return {
    object: `${BASE_URL}/:objectId`
  };
};
