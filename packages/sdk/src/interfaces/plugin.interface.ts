import {CorePluginPropsInterface} from './pluginProps.interface';
import {UsePluginHookType} from './usePluginHook.interface';

export interface PluginInterface<T extends CorePluginPropsInterface = CorePluginPropsInterface> {
  usePlugin: UsePluginHookType<T>;
}
