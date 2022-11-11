import {PluginConfigInterface} from './pluginConfig.interface';

export interface PluginStateApiInterface<C extends PluginConfigInterface = PluginConfigInterface> {
  getItem: <T>(key: string) => Promise<T>;
  setItem: <T>(key: string, value: T extends undefined ? never : T) => Promise<T>;
  deleteItem: (key: string) => Promise<null>;
  getConfig: () => Promise<C>;
}
