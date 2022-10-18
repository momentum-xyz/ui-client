//import {appVariables} from 'api/constants';

export const web3RepositoryEndpoints = () => {
  // const BASE_URL = `${appVariables.WEB3_IDENTITY_PROVIDER_URL}/v0/web3`;
  // TODO: Temp solution. To fix later ...
  const BASE_URL = `https://dev2.odyssey.ninja/guest-idp/v0/guest`;

  return {
    challenge: `${BASE_URL}/challenge`,
    login: `${BASE_URL}/login`,
    consent: `${BASE_URL}/consent`
  };
};
