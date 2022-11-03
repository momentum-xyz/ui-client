import {MagicTypeEnum} from 'core/enums';
import {MagicLinkInterface} from 'core/interfaces';

export interface MagicLinkGenerateRequest {
  key: string;
  data: {
    type: MagicTypeEnum;
    spaceId?: string;
    eventId?: string;
    position?: any;
  };
}

export interface MagicLinkGetRequest {
  id: string;
}

export interface MagicLinkResponse extends MagicLinkInterface {}

export interface FetchMagicLinkRequest {
  key: string;
}
