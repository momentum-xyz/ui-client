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
  spaceId: {
    type: string;
    data: Buffer;
  };
  integrationTypeId: {
    type: string;
    data: Buffer;
  };
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

export interface GoogleDocumentInterface {
  id: string;
  name: string;
  url: string;
}

/** FETCH CURRENT INTEGRATION **/

export interface FetchIntegrationRequest {
  spaceId: string;
  integrationType: IntegrationTypeEnum;
}

export interface FetchIntegrationResponse extends IntegrationInterface {}

/** ENABLE MIRO INTEGRATION **/

export interface EnableMiroIntegrationRequest {
  spaceId: string;
  data: MiroBoardInterface;
}

export interface EnableMiroIntegrationResponse {}

/** DISABLE MIRO INTEGRATION **/

export interface DisableMiroIntegrationRequest {
  spaceId: string;
}

export interface DisableMiroIntegrationResponse extends IntegrationInterface {}

/** ENABLE GOOGLE DRIVE INTEGRATION **/

export interface EnableGoogleDriveIntegrationRequest {
  spaceId: string;
  data: GoogleDocumentInterface;
}

export interface EnableGoogleDriveIntegrationResponse {}

/** DISABLE GOOGLE DRIVE INTEGRATION **/

export interface DisableGoogleDriveIntegrationRequest {
  spaceId: string;
}

export interface DisableGoogleDriveIntegrationResponse extends IntegrationInterface {}
