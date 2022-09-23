import {PluginPropsInterface} from './pluginProps.interface';

export interface PluginInterface {
  name: string;
  subPath: string;
  subtitle?: string;
  url: string;
  exact?: boolean;
  props?: PluginPropsInterface;
  module?: string;
  iconName: IconNameType;
}
