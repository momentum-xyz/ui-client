import {MagicTypeEnum} from 'core/enums';

export interface MagicLinkInterface {
  type: MagicTypeEnum;
  spaceId: string;
  eventId?: string;
  position?: any;
}
