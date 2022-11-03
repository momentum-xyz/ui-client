import {MagicTypeEnum} from 'core/enums';

export interface MagicLinkInterface {
  data: {
    type: MagicTypeEnum;
    spaceId: string;
    eventId?: string;
    position?: any;
  };
}
