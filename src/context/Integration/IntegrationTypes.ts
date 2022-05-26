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
  broadcastStatus?: BroadcastStatus;
  name?: string;
  url?: string;
  youtubeUrl?: string;
  viewLink?: string;
  embedHtml?: string;
  accessLink?: string;
  accessLinkPolicy?: string;
  stageModeStatus?: StageModeStatus;
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

export enum BroadcastStatus {
  FORCE_SMALL = 'force_small',
  PLAY_SMALL = 'play_small',
  FORCE_LARGE = 'force_large',
  PLAY_LARGE = 'play_large',
  PLAY = 'play',
  STOP = 'stop'
}

export enum ModerationType {
  ADMIT = 'admit',
  KICK = 'kick'
}

export enum StageModeStatus {
  INITIATED = 'initiated',
  STOPPED = 'stopped'
}

export enum StageModeUserRole {
  SPEAKER = 'speaker',
  INVITED = 'invited',
  AUDIENCE_MEMBER = 'audience_member'
}
