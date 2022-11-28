import {IconNameType, SizeType} from '../types';

export interface ToolbarIconInterface {
  title: string;
  link?: string;
  icon?: IconNameType;
  size?: SizeType;
  // @ts-ignore: add types
  isActive?: (match, location) => boolean;
  onClick?: () => void;
  disabled?: boolean;
}
