import {appVariables} from 'api/constants';

export const stageModeRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/stage-mode`;

  // FIXME: use params :spaceId
  return {
    leave: `${BASE_URL}/:spaceId/leave`,
    join: `${BASE_URL}/:spaceId/join`,
    invite: `${BASE_URL}/:spaceId/invite`,
    inviteResponse: `${BASE_URL}/:spaceId/invite/response`,
    request: `${BASE_URL}/:spaceId/request`,
    requestResponse: `${BASE_URL}/:spaceId/request/response`,
    admitOrKick: `${BASE_URL}/:spaceId/admit-or-kick`,
    mute: `${BASE_URL}/:spaceId/mute`,
    getUsers: `${BASE_URL}/:spaceId/get-users`
  };
};
