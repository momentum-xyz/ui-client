import {PluginPropsInterface} from './pluginProps.interface';

interface UsePluginHookReturnInterface {
  content?: JSX.Element | null;
  objectView?: {
    title?: string;
    subtitle?: string;
    actions?: JSX.Element | null;
    content: JSX.Element | null;
  };
}

export type UsePluginHookType<C = unknown> = (
  props: PluginPropsInterface<C>
) => UsePluginHookReturnInterface;
