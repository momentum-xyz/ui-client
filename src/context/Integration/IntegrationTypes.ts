import {StageModeStatusEnum, BroadcastStatusEnum} from 'core/enums';

export interface IntegrationDTO {
  spaceId: string;
  integrationType: IntegrationTypes;
  stageModeRequestType?: StageModeRequestType;
  spaceIntegrationUsers?: SpaceIntegrationUser[];
  modType?: ModerationType;
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
  role?: StageModeUserRole;
}

export enum IntegrationTypes {
  MIRO = 'miro',
  GOOGLE_DRIVE = 'google_drive',
  BROADCAST = 'broadcast',
  STAGE_MODE = 'stage_mode'
}

export enum StageModeRequestType {
  REQUEST = 'request',
  INVITE = 'invite',
  ACCEPT = 'accept',
  DECLINE = 'decline',
  NONE = ''
}

export enum ModerationType {
  ADMIT = 'admit',
  KICK = 'kick'
}

export enum StageModeUserRole {
  SPEAKER = 'speaker',
  INVITED = 'invited',
  AUDIENCE_MEMBER = 'audience_member'
}
