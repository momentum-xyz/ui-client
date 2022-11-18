import {PluginConfigInterface} from './pluginConfig.interface';
import {UsePluginHookType} from './usePluginHook.interface';

export interface PluginInterface<T extends PluginConfigInterface = PluginConfigInterface> {
  usePlugin: UsePluginHookType<T>;
}
