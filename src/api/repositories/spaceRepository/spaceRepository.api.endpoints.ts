import {endpoints} from 'api/constants';

const BASE_URL = `${endpoints.backendUrl}/space`;

export const spaceRepositoryEndpoints = {
  user: `${BASE_URL}/user`,
  edit: `${BASE_URL}/edit`,
  delete: `${BASE_URL}/delete`,
  create: `${BASE_URL}/create`,
  unassignUser: `${BASE_URL}/unassign-user`,
  assignUser: `${BASE_URL}/assign-user`,
  ownedSpaces: `${BASE_URL}/owned-spaces`,
  createInitiative: `${BASE_URL}/create-initiative`
};
