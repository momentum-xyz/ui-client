import {MagicTypeEnum} from 'core/enums';

export interface MagicLinkInterface {
  type: MagicTypeEnum;
  data: {
    odysseyId: string;
    position?: any;
  };
}
