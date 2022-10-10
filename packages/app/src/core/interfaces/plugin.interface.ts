import {IconNameType} from '@momentum/ui-kit';

export interface PluginInterface {
  id: string;
  subPath: string;
  subtitle?: string;
  url: string;
  exact?: boolean;
  iconName: IconNameType;
}
