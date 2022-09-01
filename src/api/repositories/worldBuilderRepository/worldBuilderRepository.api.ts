import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {worldBuilderEndpoints} from './worldBuilderRepository.api.endpoints';
import {
  ValidateDomainNameResponse,
  ValidationRequest,
  ValidationResponse
} from './worldBuilderRepository.api.types';

export const validateName: RequestInterface<ValidationRequest, ValidationResponse> = (options) => {
  const {name, ...restOptions} = options;

  restOptions.data = {name};

  return request.get(worldBuilderEndpoints().validateName, restOptions);
};

export const valiedateDomain: RequestInterface<ValidationRequest, ValidateDomainNameResponse> = (
  options
) => {
  const {name, ...restOptions} = options;

  restOptions.data = {name};

  return request.get(worldBuilderEndpoints().valiedateDomain, restOptions);
};
