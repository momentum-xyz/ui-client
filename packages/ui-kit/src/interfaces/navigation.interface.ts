import {IconNameType} from '../types';

export interface NavigationTabInterface {
  path: string;
  iconName: IconNameType;
  isActive?: boolean;
  isHidden?: boolean;
  replace?: boolean;
  canGoBack?: boolean;
  exact?: boolean;
}
