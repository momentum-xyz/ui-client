import {MagicTypeEnum} from 'core/enums';
import {MagicLinkInterface} from 'core/interfaces';

export interface MagicLinkGenerateRequest {
  position?: any;
  eventId?: string;
  spaceId: string;
  key: string;
  type: MagicTypeEnum;
}

export interface MagicLinkGetRequest {
  id: string;
}

export interface MagicLinkResponse extends MagicLinkInterface {}

export interface FetchMagicLinkRequest {
  key: string;
  worldId: string;
}
