import {MagicTypeEnum} from 'core/enums';
import {MagicLinkInterface} from 'core/interfaces';

export interface MagicLinkGenerateRequest {
  id?: string;
  key?: string;
  data: any;
  type: MagicTypeEnum;
}

export interface MagicLinkGetRequest {
  key: string;
}

export interface MagicLinkResponse extends MagicLinkInterface {}
