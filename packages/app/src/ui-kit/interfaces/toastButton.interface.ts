import {IconNameType} from '@momentum-xyz/ui-kit';

export interface ToastButtonInfoInterface {
  title: string;
  icon?: IconNameType;
  onClick?: () => void;
}
