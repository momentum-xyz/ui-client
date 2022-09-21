import {PluginConfigInterface} from './pluginConfig.interface';

export interface PluginLoaderInterface {
  name: string;
  url: string;
  exact?: boolean;
  config: PluginConfigInterface;
  module?: string;
}
