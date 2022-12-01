import {appVariables} from 'api/constants';

export const agoraRepositoryApiEndpoints_old = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/agora`;

  return {
    token: `${BASE_URL}/token/:channelId`,
    tokenScreenshare: `${BASE_URL}/token/:channelId/screenshare`,
    relayScreenShare: `${BASE_URL}/screen-share/:spaceId`
  };
};
