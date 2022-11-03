import {PluginConfigInterface} from './pluginConfig.interface';

export interface APIInterface<C extends PluginConfigInterface> {
  get: <T>(key: string) => Promise<T>;
  set: <T>(key: string, value: T extends undefined ? never : T) => Promise<void>;
  getConfig: () => Promise<C>;
}
