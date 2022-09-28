import {MagicTypeEnum} from 'core/enums';

export interface MagicLinkInterface {
  id: string;
  key: string;
  data: {
    id: string;
    eventId?: string;
    position?: any;
  };
  type: MagicTypeEnum;
  expired: string;
  updated_at: string;
  created_at: string;
}
