import {endpoints} from 'api/constants';

const BASE_URL = `${endpoints.backendUrl}/users`;

export const userRepositoryEndpoints = {
  me: `${BASE_URL}/me`,
  check: `${BASE_URL}/check`,
  avatarUpload: `${BASE_URL}/avatar/upload`,
  inviteToSpace: `${BASE_URL}/invite`,
  search: `${BASE_URL}/search`,
  profile: `${BASE_URL}/profile`,
  online: `${BASE_URL}/online`,
  initiatives: `${BASE_URL}/users/:userId/initiatives`
};
