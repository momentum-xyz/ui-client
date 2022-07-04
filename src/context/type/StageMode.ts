import {ModerationEnum, StageModeRequestEnum, StageModeStatusEnum} from 'core/enums';

export interface StageModeRequestDto {
  userId?: string;
  stageModeRequestType: StageModeRequestEnum;
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
    stageModeStatus: StageModeStatusEnum;
  };
}

export interface AdmitOrKickDTO {
  modType: ModerationEnum;
  userId: string;
}

export interface Volume {
  uid: string;
  level: number;
}
