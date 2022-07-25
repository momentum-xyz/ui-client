import {
  BroadcastStatusEnum,
  IntegrationTypeEnum,
  ModerationEnum,
  StageModeRequestEnum,
  StageModeStatusEnum,
  StageModeUserRoleEnum
} from 'core/enums';

/** COMMON **/

export interface IntegrationInterface {
  spaceId: string;
  integrationType: IntegrationTypeEnum;
  data: IntegrationDataInterface;
  stageModeRequestType?: StageModeRequestEnum;
  spaceIntegrationUsers?: IntegrationUserInterface[];
  modType?: ModerationEnum;
}

export interface IntegrationUserInterface {
  spaceId: Buffer;
  integrationTypeId: Buffer;
  userId: {
    type: string;
    data: Buffer;
  };
  flag: number;
  data: {
    role?: StageModeUserRoleEnum;
  };
}

export interface IntegrationDataInterface {
  id?: string;
  broadcastStatus?: BroadcastStatusEnum;
  name?: string;
  url?: string;
  youtubeUrl?: string;
  viewLink?: string;
  embedHtml?: string;
  accessLink?: string;
  accessLinkPolicy?: string;
  stageModeStatus?: StageModeStatusEnum;
  userId?: string;
}

export interface MiroBoardInterface {
  id: string;
  name: string;
  description: string;
  viewLink: string;
  accessLink: string;
  embedHtml: string;
}

/** FETCH CURRENT INTEGRATION **/

export interface FetchIntegrationRequest {
  spaceId: string;
  integrationType: IntegrationTypeEnum;
}

export interface FetchIntegrationResponse extends IntegrationInterface {}

/** ENABLE INTEGRATION **/

export interface EnableIntegrationRequest {
  spaceId: string;
  integrationType: IntegrationTypeEnum;
  data: MiroBoardInterface;
}

export interface EnableIntegrationResponse {}

/** DISABLE INTEGRATION **/

export interface DisableIntegrationRequest extends IntegrationInterface {}

export interface DisableIntegrationResponse extends IntegrationInterface {}
