import {PluginConfigInterface} from './pluginConfig.interface';
import {CorePluginPropsInterface} from './pluginProps.interface';

interface UsePluginHookReturnInterface {
  content: JSX.Element | null;
  topBar: JSX.Element | null;
  subtitle?: string;
}

export type UsePluginHookType<T extends PluginConfigInterface> = (
  props: CorePluginPropsInterface<T>
) => UsePluginHookReturnInterface;
