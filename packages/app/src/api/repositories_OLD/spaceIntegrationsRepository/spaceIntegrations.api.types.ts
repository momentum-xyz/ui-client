import {
  BroadcastStatusEnum,
  IntegrationTypeEnum,
  ModerationEnum,
  StageModeRequestEnum,
  StageModeStatusEnum,
  StageModeUserRoleEnum
} from 'core/enums';

export interface SpaceIntegrationUserInterface {
  spaceId: Buffer;
  integrationTypeId: Buffer;
  userId: {
    type: string;
    data: Buffer;
  };
  flag: number;
  data: SpaceIntegrationUserDataInterface;
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
  channelId?: string;
}

export interface SpaceIntegrationUserDataInterface {
  role?: StageModeUserRoleEnum;
}

export interface SpaceIntegrationsStageModeRequest {
  spaceId: string;
}

export interface SpaceIntegrationInterface {
  spaceId: {
    type: string;
    data: Buffer;
  };
  integrationTypeId: {
    type: string;
    data: Buffer;
  };
  data?: IntegrationDataInterface;
}

export interface SpaceIntegrationsStageModeResponse
  extends Omit<SpaceIntegrationInterface, 'spaceId'> {
  spaceId: string;
  integrationType: IntegrationTypeEnum;
  stageModeRequestType?: StageModeRequestEnum;
  spaceIntegrationUsers?: SpaceIntegrationUserInterface[];
  modType?: ModerationEnum;
}

export interface SpaceIntegrationEnableRequest {
  spaceId: string;
  userId: string;
}

export interface SpaceIntegrationDisableRequest {
  spaceId: string;
  userId: string;
}

export interface SpaceIntegrationsCheckRequest {
  spaceId: string;
}

export interface SpaceIntegrationsCheckResponse extends Boolean {}
