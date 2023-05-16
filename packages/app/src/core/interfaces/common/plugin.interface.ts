import {IconNameType} from '@momentum-xyz/ui-kit-storybook';

export interface PluginInterface {
  id: string;
  name: string;
  scopeName: string;
  subtitle?: string;
  scriptUrl: string;
  exact?: boolean;
  iconName: IconNameType;
}
