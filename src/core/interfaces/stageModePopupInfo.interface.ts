import {StageModePopupTypeEnum} from 'core/enums';

export interface StageModePopupInfoInterface {
  userId?: string;
  type: StageModePopupTypeEnum;
  user?: string;
  userName?: string;
  onAccept?: () => Promise<boolean>;
  onDecline?: () => Promise<boolean>;
}
