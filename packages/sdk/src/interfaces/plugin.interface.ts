import {UsePluginHookType} from './usePluginHook.interface';

export interface PluginInterface<C = unknown> {
  usePlugin: UsePluginHookType<C>;
}
