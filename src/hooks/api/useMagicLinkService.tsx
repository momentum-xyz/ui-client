import {MagicTypeEnum} from 'core/enums';

export interface MagicLinkData {
  id: string;
  eventId?: string;
  position?: any;
}

export interface MagicLinkDTO {
  id?: string;
  key?: string;
  data: any;
  type: MagicTypeEnum;
}
