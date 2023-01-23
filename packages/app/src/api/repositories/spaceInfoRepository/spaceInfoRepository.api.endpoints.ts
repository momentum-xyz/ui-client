export const spaceInfoRepository = () => {
  const BASE_URL = '/spaces';

  return {
    spaceInfo: `${BASE_URL}/:spaceId`
  };
};
