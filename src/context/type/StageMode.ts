export enum StageModeRequestType {
  REQUEST = 'request',
  INVITE = 'invite',
  ACCEPT = 'accept',
  DECLINE = 'decline'
}

export enum StageModeStatus {
  INITIATED = 'initiated',
  STOPPED = 'stopped'
}

export enum ModType {
  KICK = 'kick',
  ADMIT = 'admit'
}

export interface StageModeRequestDto {
  userId?: string;
  stageModeRequestType: StageModeRequestType;
  data?: {
    userId?: string;
  };
}

export interface StageModeStatusInfoDto {
  spaceId: {
    type: string;
    data: Buffer;
  };
  integrationTypeId: {
    type: string;
    data: Buffer;
  };
  data: {
    channelId: string;
    userId: string;
    stageModeStatus: StageModeStatus;
  };
}

export interface AdmitOrKickDTO {
  modType: ModType;
  // spaceId?: string;
  userId: string;
}

export interface Volume {
  uid: string;
  level: number;
}
