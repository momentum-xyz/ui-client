import {CorePluginPropsInterface} from './pluginProps.interface';

interface UsePluginHookReturnInterface {
  content: JSX.Element | null;
}

export type UsePluginHookType<T extends CorePluginPropsInterface> = (
  props: T
) => UsePluginHookReturnInterface;
