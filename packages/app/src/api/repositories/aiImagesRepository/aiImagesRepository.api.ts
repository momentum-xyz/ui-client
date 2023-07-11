import {generatePath} from 'react-router-dom';
import {RequestInterface} from '@momentum-xyz/core';

import {request} from 'api/request';

import {aiImagesRepositoryEndpoints} from './aiImagesRepository.api.endpoints';
import {
  FetchAIGeneratedImagesRequest,
  FetchAIGeneratedImagesResponse,
  GenerateAIImagesRequest,
  GenerateAIImagesResponse
} from './aiImagesRepository.api.types';

export const generateImages: RequestInterface<GenerateAIImagesRequest, GenerateAIImagesResponse> = (
  options
) => {
  const {model, prompt, ...rest} = options;
  return request.post(aiImagesRepositoryEndpoints().generate, {model, prompt}, rest);
};

export const fetchImages: RequestInterface<
  FetchAIGeneratedImagesRequest,
  FetchAIGeneratedImagesResponse
> = (options) => {
  const {leonardoId, ...rest} = options;
  const url = generatePath(aiImagesRepositoryEndpoints().fetch, {leonardoId});

  return request.get(url, rest);
};
