import {appVariables} from 'api/constants';

export const guestRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.GUEST_IDENTITY_PROVIDER_URL}/v0/guest`;

  return {
    login: `${BASE_URL}/login`,
    consent: `${BASE_URL}/consent`
  };
};
