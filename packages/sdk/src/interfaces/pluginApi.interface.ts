import {PluginConfigInterface} from './pluginConfig.interface';

export interface PluginApiInterface<C extends PluginConfigInterface = PluginConfigInterface> {
  getStateItem: <T>(key: string) => Promise<T>;
  setStateItem: <T>(key: string, value: T extends undefined ? never : T) => Promise<T>;
  deleteStateItem: (key: string) => Promise<null>;
  getConfig: () => Promise<C>;

  useStateItemChange: <T = unknown>(key: string, callback: (value: T) => void) => void;
  useStateItemRemove: (key: string, callback: () => void) => void;
}
