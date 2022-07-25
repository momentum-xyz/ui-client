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
  data: SpaceIntegrationUserData;
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

export interface SpaceIntegrationUserData {
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
}

export interface SpaceIntegrationDisablevoidRequest {
  spaceId: string;
}
