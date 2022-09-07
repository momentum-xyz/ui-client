import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {worldBuilderEndpoints} from './worldBuilderRepository.api.endpoints';
import {
  PermissionsRequest,
  PermissionsResponse,
  TemplatesRequest,
  TemplatesResponse,
  ValidateDomainNameResponse,
  ValidationRequest,
  ValidationResponse
} from './worldBuilderRepository.api.types';

export const validateName: RequestInterface<ValidationRequest, ValidationResponse> = (options) => {
  const {name, ...restOptions} = options;

  return request.post(worldBuilderEndpoints().validateName, {name}, restOptions);
};

export const valiedateDomain: RequestInterface<ValidationRequest, ValidateDomainNameResponse> = (
  options
) => {
  const {name, ...restOptions} = options;

  return request.post(worldBuilderEndpoints().valiedateDomain, {name}, restOptions);
};

export const getTemplates: RequestInterface<TemplatesRequest, TemplatesResponse> = (options) => {
  return request.get(worldBuilderEndpoints().templates, options);
};

export const checkPermissions: RequestInterface<PermissionsRequest, PermissionsResponse> = (
  options
) => {
  return request.post(worldBuilderEndpoints().checkPermissions, {}, options);
};
