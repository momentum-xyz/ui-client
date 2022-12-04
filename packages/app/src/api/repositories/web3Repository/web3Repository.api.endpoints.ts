import {appVariables} from 'api/constants';

export const web3RepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.WEB3_IDENTITY_PROVIDER_URL}/v0/web3`;
  const BASE_URL_DRIVE = `${appVariables.BACKEND_API_URL}/drive`;

  return {
    challenge: `${BASE_URL}/challenge`,
    login: `${BASE_URL}/login`,
    consent: `${BASE_URL}/consent`,
    mintNft: `${BASE_URL_DRIVE}/mint-odyssey`,
    mintNftCheckJob: `${BASE_URL_DRIVE}/mint-odyssey/check-job/:job_id`
  };
};
