import {Method} from 'axios';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {web3RepositoryEndpoints} from './web3Repository.api.endpoints';
import {
  MintNftRequest,
  MintNftResponse,
  MintNftCheckJobRequest,
  MintNftCheckJobResponse,
  ResolveNodeRequest,
  ResolveNodeResponse
} from './web3Repository.api.types';

export const mintNft: RequestInterface<MintNftRequest, MintNftResponse> = (options) => {
  const {name, image, block_hash, wallet, ...rest} = options;
  const requestParams = {
    method: 'post' as Method,
    data: {block_hash, wallet, meta: {name, image}},
    ...rest
  };

  const URL: string = web3RepositoryEndpoints().mintNft;
  return request(URL, requestParams);
};

export const mintNftCheckJob: RequestInterface<MintNftCheckJobRequest, MintNftCheckJobResponse> = (
  options
) => {
  const {job_id, ...rest} = options;
  const URL: string = generatePath(web3RepositoryEndpoints().mintNftCheckJob, {job_id});
  return request.get(URL, rest);
};

export const resolveNode: RequestInterface<ResolveNodeRequest, ResolveNodeResponse> = (options) => {
  const {object, ...restOptions} = options;

  restOptions.params = {
    object_id: object
  };

  return request.get(web3RepositoryEndpoints().resolveNode, restOptions);
};
