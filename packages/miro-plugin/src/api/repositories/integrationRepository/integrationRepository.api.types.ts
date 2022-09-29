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

/** FETCH CURRENT INTEGRATION **/

export interface FetchIntegrationRequest {
  spaceId: string;
}

export interface FetchIntegrationResponse extends IntegrationInterface {}

/** ENABLE MIRO INTEGRATION **/

export interface EnableMiroIntegrationRequest {
  spaceId: string;
  data: MiroBoardInterface;
  integrationType: 'miro';
}

export interface EnableMiroIntegrationResponse {}
/** DISABLE MIRO INTEGRATION **/

export interface DisableMiroIntegrationRequest {
  spaceId: string;
  data: MiroBoardInterface;
  integrationType: 'miro';
}

export interface DisableMiroIntegrationResponse extends IntegrationInterface {}
