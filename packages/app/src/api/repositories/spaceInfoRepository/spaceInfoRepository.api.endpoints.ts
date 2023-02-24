export const spaceInfoRepository = () => {
  const BASE_URL = '/objects';

  return {
    spaceInfo: `${BASE_URL}/:spaceId`
  };
};
