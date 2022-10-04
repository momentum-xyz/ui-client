import {IconNameType} from '../types';

export interface TabBarTabInterface {
  id: string;
  title: string;
  label: string;
  icon?: IconNameType;
  disabled?: boolean;
}
