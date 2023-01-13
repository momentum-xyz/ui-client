import {appVariables} from 'api/constants';

export const web3RepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/drive`;

  return {
    mintNft: `${BASE_URL}/mint-odyssey`,
    mintNftCheckJob: `${BASE_URL}/mint-odyssey/check-job/:job_id`,
    resolveNode: `${BASE_URL}/resolve-node`
  };
};
