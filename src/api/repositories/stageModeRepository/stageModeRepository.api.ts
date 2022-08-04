import {generatePath} from 'react-router-dom';

import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';
import {StageModeRequestEnum} from 'core/enums';

import {
  StageModeAdmitOrKickRequest,
  StageModeInviteRequest,
  StageModeJoinResponse,
  StageModeRequest,
  StageModeRequestRequest,
  StageModeResponse,
  StageModeResponseRequest
} from './stageModeRepository.api.types';
import {stageModeRepositoryEndpoints} from './stageModeRepository.api.endpoints';

export const leaveStageMode: RequestInterface<StageModeRequest, StageModeResponse> = (options) => {
  const {spaceId, ...restOptions} = options;
  const url = generatePath(stageModeRepositoryEndpoints().leave, {spaceId});

  return request.post(url, restOptions);
};

export const joinStageMode: RequestInterface<StageModeRequest, StageModeJoinResponse> = (
  options
) => {
  const {spaceId, ...restOptions} = options;
  const url = generatePath(stageModeRepositoryEndpoints().join, {spaceId});

  return request.post(url, restOptions);
};

export const inviteToStage: RequestInterface<StageModeInviteRequest, void> = (options) => {
  const {spaceId, userId, ...restOptions} = options;
  const url = generatePath(stageModeRepositoryEndpoints().invite, {spaceId, userId});

  return request.post(url, restOptions);
};

export const respondToInvite: RequestInterface<StageModeResponseRequest, void> = (options) => {
  const {spaceId, stageModeRequestType, ...restOptions} = options;

  const url = generatePath(stageModeRepositoryEndpoints().inviteResponse, {spaceId});
  return request.post(url, {stageModeRequestType}, restOptions);
};

export const respondToRequest: RequestInterface<StageModeResponseRequest, void> = (options) => {
  const {spaceId, userId, stageModeRequestType, ...restOptions} = options;
  const url = generatePath(stageModeRepositoryEndpoints().requestResponse, {spaceId});

  return request.post(url, {userId, stageModeRequestType}, restOptions);
};

export const admitOrKick: RequestInterface<StageModeAdmitOrKickRequest, void> = (options) => {
  const {spaceId, modType, userId, ...restOptions} = options;
  const url = generatePath(stageModeRepositoryEndpoints().admitOrKick, {spaceId});

  return request.post(url, {modType, userId}, restOptions);
};

export const requestToJoin: RequestInterface<StageModeRequestRequest, void> = (options) => {
  const {spaceId, userId, ...restOptions} = options;
  const url = generatePath(stageModeRepositoryEndpoints().request, {spaceId});

  return request.post(
    url,
    {data: {userId}, stageModeRequestType: StageModeRequestEnum.REQUEST},
    restOptions
  );
};

export const mute: RequestInterface<StageModeRequestRequest, void> = (options) => {
  const {spaceId, userId, ...restOptions} = options;
  const url = generatePath(stageModeRepositoryEndpoints().mute, {spaceId});

  return request.post(url, {userId}, restOptions);
};
