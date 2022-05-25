import {appVariables} from 'api/constants';

import {
  AdmitOrKickDTO,
  ModType,
  StageModeRequestDto,
  StageModeRequestType,
  StageModeStatusInfoDto
} from '../../context/type/StageMode';
import {IntegrationDTO} from '../../context/Integration/IntegrationTypes';

import {useFetch, usePost} from './useApi';

export const useStageModeJoin = (spaceId?: string) => {
  const [stageModeJoin, , ,] = usePost<IntegrationDTO>(
    appVariables.BACKEND_ENDPOINT_URL + `/stage-mode/${spaceId}/join`
  );

  return () => stageModeJoin({});
};

export const useStageModeLeave = (spaceId?: string) => {
  const [stageModeLeave, , ,] = usePost<IntegrationDTO>(
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    appVariables.BACKEND_ENDPOINT_URL + `/stage-mode/${spaceId}/leave`
  );

  return () => {
    return stageModeLeave({});
  };
};

export const useStageModeStatusInfo = (spaceId?: string) => {
  const [data, , ,] = useFetch<StageModeStatusInfoDto>(
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    // window._env_.BACKEND_ENDPOINT_URL + `/stage-mode/${spaceId}`,
    appVariables.BACKEND_ENDPOINT_URL + `/space-integrations/${spaceId ? spaceId : ''}/stage_mode`,
    {
      fetchPolicy: 'network-only'
    }
  );

  return data;
};

export const useStageModeRequestInvite = (spaceId?: string) => {
  const [postRequest, , ,] = usePost(
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    appVariables.BACKEND_ENDPOINT_URL + `/stage-mode/${spaceId}/invite`
  );

  const body = (userId: string) => {
    return {
      userId: userId
    };
  };

  return (userId: string) => postRequest(body(userId));
};

export const useStageModeInvitationAcceptOrDecline = (spaceId?: string) => {
  const [postResponse, , ,] = usePost<void, StageModeRequestDto>(
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    appVariables.BACKEND_ENDPOINT_URL + `/stage-mode/${spaceId}/invite/response`
  );

  const stageModeInvitationAcceptOrDecline = (
    responseType: StageModeRequestType.ACCEPT | StageModeRequestType.DECLINE
  ) => {
    return () =>
      postResponse({
        stageModeRequestType: responseType
      });
  };

  const stageModeAcceptOrDecline: [() => Promise<void>, () => Promise<void>] = [
    stageModeInvitationAcceptOrDecline(StageModeRequestType.ACCEPT),
    stageModeInvitationAcceptOrDecline(StageModeRequestType.DECLINE)
  ];

  return stageModeAcceptOrDecline;
};

export const useStageModeRequestAcceptOrDecline = (spaceId?: string) => {
  const [postResponse, , ,] = usePost<void, StageModeRequestDto>(
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    appVariables.BACKEND_ENDPOINT_URL + `/stage-mode/${spaceId}/request/response`
  );

  const stageModeRequestAcceptOrDecline = (
    responseType: StageModeRequestType.ACCEPT | StageModeRequestType.DECLINE
  ) => {
    return (userId: string) =>
      postResponse({
        userId: userId,
        stageModeRequestType: responseType
      });
  };

  // @ts-ignore
  const stageModeAcceptOrDecline: [(userId) => Promise<void>, (userId) => Promise<void>] = [
    stageModeRequestAcceptOrDecline(StageModeRequestType.ACCEPT),
    stageModeRequestAcceptOrDecline(StageModeRequestType.DECLINE)
  ];

  return stageModeAcceptOrDecline;
};

export const useStageModeSendOffstage = (spaceId?: string) => {
  const [postRequest, response, , error] = usePost<AdmitOrKickDTO, AdmitOrKickDTO>(
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    appVariables.BACKEND_ENDPOINT_URL + `/stage-mode/${spaceId}/admit-or-kick`
  );

  const sendOffstage = (userId: string) =>
    postRequest({
      userId: userId,
      modType: ModType.KICK
    });

  const stageModeSendOffstage: [
    (userId: string) => Promise<AdmitOrKickDTO>,
    AdmitOrKickDTO | undefined,
    Error | null
  ] = [sendOffstage, response, error];

  return stageModeSendOffstage;
};

export const useJoinRequest = (spaceId?: string) => {
  const [postRequest, , ,] = usePost(
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    appVariables.BACKEND_ENDPOINT_URL + `/stage-mode/${spaceId}/request`
  );

  const body = (userId: string) => {
    return {
      data: {
        userId: userId
      },
      stageModeRequestType: StageModeRequestType.REQUEST
    };
  };
  return (userId: string) => postRequest(body(userId));
};

export const useStageModeMute = (spaceId?: string) => {
  const [postRequest, , ,] = usePost(
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    appVariables.BACKEND_ENDPOINT_URL + `/stage-mode/${spaceId}/mute`
  );

  const body = (userId: string) => {
    return {
      userId: userId
    };
  };

  return (userId: string) => postRequest(body(userId));
};
