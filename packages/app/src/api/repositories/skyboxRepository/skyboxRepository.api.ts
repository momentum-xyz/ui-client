import {generatePath} from 'react-router-dom';
import {RequestInterface} from '@momentum-xyz/core';

import {request} from 'api/request';

import {skyboxRepositoryEndpoints} from './skyboxRepository.api.endpoints';
import {
  FetchAIStylesResponse,
  FetchGeneratedSkyboxRequest,
  GenerateSkyboxRequest,
  GenerateSkyboxResponse
} from './skyboxRepository.api.types';

export const generateSkybox: RequestInterface<GenerateSkyboxRequest, GenerateSkyboxResponse> = ({
  skybox_style_id,
  prompt,
  world_id
}) => {
  const url = skyboxRepositoryEndpoints().generate;

  return request.post(url, {
    skybox_style_id,
    prompt,
    world_id
  });
};

export const fetchGeneratedSkybox: RequestInterface<FetchGeneratedSkyboxRequest, any> = ({
  skyboxId
}) => {
  const url = generatePath(skyboxRepositoryEndpoints().skybox, {skyboxId});
  return request.get(
    url,
    // {responseType: 'blob'}
    {responseType: 'arraybuffer'}
  );
};

export const fetchAIStyles: RequestInterface<null, FetchAIStylesResponse> = () => {
  const url = skyboxRepositoryEndpoints().styles;

  return request.get(url);
};
