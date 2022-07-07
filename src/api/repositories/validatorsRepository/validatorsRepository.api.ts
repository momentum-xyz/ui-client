import {AxiosRequestConfig, Method} from 'axios';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {validatorRepositoryEndpoints} from './validatorsRepository.api.endpoints';
import {
  FetchValidatorsResponseInterface,
  BaseValidatorsRequestInterface,
  UpdateValidatorBookmarkRequestInterface,
  UpdateValidatorBookmarkResponseInterface
} from './validatorsRepository.api.types';

export const fetchValidators: RequestInterface<
  BaseValidatorsRequestInterface,
  FetchValidatorsResponseInterface
> = (options) => {
  const {withIdentity, parentSpaceId, ...restOptions} = options;

  const config: AxiosRequestConfig = {
    ...restOptions,
    params: {
      ...(withIdentity && {withIdentity: true}),
      ...(parentSpaceId && {parentSpaceId})
    }
  };

  const url = validatorRepositoryEndpoints().getValidators;
  return request.get(url, config);
};

export const updateBookmark: RequestInterface<
  UpdateValidatorBookmarkRequestInterface,
  UpdateValidatorBookmarkResponseInterface
> = (options) => {
  const {id, bookmark, ...rest} = options;
  const requestParams = {
    method: 'put' as Method,
    data: {id, bookmark},
    ...rest
  };

  return request(validatorRepositoryEndpoints().bookmark, requestParams);
};
