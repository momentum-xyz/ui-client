import {PluginConfigInterface} from './pluginConfig.interface';

export interface PluginInterface {
  name: string;
  subtitle?: string;
  url: string;
  exact?: boolean;
  config: PluginConfigInterface;
  module?: string;
  iconName: IconNameType;
  path: string;
}
