import {IconNameType} from '@momentum-xyz/ui-kit';

export interface PluginInterface {
  id: string;
  scopeName: string;
  subPath: string;
  subtitle?: string;
  scriptUrl: string;
  exact?: boolean;
  iconName: IconNameType;
}
