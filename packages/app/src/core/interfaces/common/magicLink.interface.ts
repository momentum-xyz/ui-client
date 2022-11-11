import {MagicTypeEnum} from 'core/enums';

export interface MagicLinkInterface {
  type: MagicTypeEnum;
  data: {
    spaceId: string;
    eventId?: string;
    position?: any;
  };
}
