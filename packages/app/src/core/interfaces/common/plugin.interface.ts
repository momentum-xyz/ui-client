import {IconNameType} from '@momentum-xyz/ui-kit';

export interface PluginInterface {
  id: string;
  name: string;
  scopeName: string;
  subtitle?: string;
  scriptUrl: string;
  exact?: boolean;
  iconName: IconNameType;
}
