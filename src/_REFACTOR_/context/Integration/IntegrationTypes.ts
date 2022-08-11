import {
  ModerationEnum,
  StageModeStatusEnum,
  BroadcastStatusEnum,
  StageModeRequestEnum,
  StageModeUserRoleEnum,
  IntegrationTypeEnum
} from 'core/enums';

export interface IntegrationDTO {
  spaceId: string;
  integrationType: IntegrationTypeEnum;
  stageModeRequestType?: StageModeRequestEnum;
  spaceIntegrationUsers?: SpaceIntegrationUser[];
  modType?: ModerationEnum;
  data: IntegrationData;
}

export interface IntegrationData {
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

export interface SpaceIntegrationUser {
  spaceId: Buffer;
  integrationTypeId: Buffer;
  userId: {
    type: string;
    data: Buffer;
  };
  flag: number;
  data: SpaceIntegrationUserData;
}

export interface SpaceIntegrationUserData {
  role?: StageModeUserRoleEnum;
}
