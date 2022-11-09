import {PluginConfigInterface} from './pluginConfig.interface';

export interface PluginStateAPIInterface<C extends PluginConfigInterface = PluginConfigInterface> {
  get: <T>(key: string) => Promise<T>;
  set: <T>(key: string, value: T extends undefined ? never : T) => Promise<T>;
  delete: (key: string) => Promise<null>;
  getConfig: () => Promise<C>;
}
