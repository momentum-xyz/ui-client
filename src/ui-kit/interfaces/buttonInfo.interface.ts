import {VariantType} from 'ui-kit/types';

export interface ButtonInfoInterface {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: IconName;
  variant?: VariantType;
}

export interface ToastButtonInfoInterface {
  title: string;
  onClick: () => void;
}
