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
  spaceIntegrationUsers?: IntegrationUserInterface[];
}

export interface IntegrationUserInterface {
  spaceId: {
    type: string;
    data: Buffer;
  };
  integrationTypeId: {
    type: string;
    data: Buffer;
  };
  userId: {
    type: string;
    data: Buffer;
  };
  flag: number;
}

export interface IntegrationDataInterface {
  id?: string;
  name?: string;
  url?: string;
  youtubeUrl?: string;
  viewLink?: string;
  embedHtml?: string;
  accessLink?: string;
  accessLinkPolicy?: string;
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

export interface BroadcastInterface {
  url?: string;
  youtubeUrl?: string;
}

export interface LiveStreamInterface {
  url: string;
  users: string[];
  youtubeUrl: string;
  spaceId?: string;
  spaceName?: string;
}

/** FETCH CURRENT INTEGRATION **/

export interface FetchIntegrationRequest {
  spaceId: string;
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

/** ENABLE BROADCAST INTEGRATION **/

export interface EnableBroadcastIntegrationRequest {
  spaceId: string;
  data: BroadcastInterface;
}

export interface EnableBroadcastIntegrationResponse {}

/** DISABLE BROADCAST INTEGRATION **/

export interface DisableBroadcastIntegrationRequest {
  spaceId: string;
}

export interface DisableBroadcastIntegrationResponse extends IntegrationInterface {}
