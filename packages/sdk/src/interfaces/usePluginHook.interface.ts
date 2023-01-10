import {CorePluginPropsInterface} from './pluginProps.interface';

interface UsePluginHookReturnInterface {
  content?: JSX.Element | null;
  objectView?: {
    title?: string;
    subtitle?: string;
    actions?: JSX.Element | null;
    content: JSX.Element | null;
  };
}

export type UsePluginHookType<T extends CorePluginPropsInterface = CorePluginPropsInterface> = (
  props: T
) => UsePluginHookReturnInterface;
