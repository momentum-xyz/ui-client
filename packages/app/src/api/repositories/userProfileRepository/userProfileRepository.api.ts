import {generatePath} from 'react-router-dom';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {userRepositoryEndpoints} from './userProfileRepository.api.endpoints';
import {
  UpdateUserRequest,
  UpdateUserResponse,
  CheckProfileUpdatingJobRequest,
  CheckProfileUpdatingJobResponse
} from './userProfileRepository.api.types';

export const update: RequestInterface<UpdateUserRequest, UpdateUserResponse> = (options) => {
  const {name, profile, ...rest} = options;

  return request.patch(userRepositoryEndpoints().base, {name, profile}, rest);
};

export const checkJobById: RequestInterface<
  CheckProfileUpdatingJobRequest,
  CheckProfileUpdatingJobResponse
> = (options) => {
  const {job_id, ...rest} = options;

  const url = generatePath(userRepositoryEndpoints().checkJob, {job_id});
  return request.get(url, rest);
};
