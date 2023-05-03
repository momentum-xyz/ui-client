import {PluginPropsInterface} from './pluginProps.interface';

export interface EditObjectViewInterface {
  onSave: () => void;
}

interface UsePluginHookReturnInterface {
  content?: JSX.Element | null;
  objectView?: {
    title?: string;
    subtitle?: string;
    actions?: JSX.Element | null;
    content: JSX.Element | null;
    editModeContent?: JSX.Element | null;
    saveChanges?: () => Promise<void>;
  };
}

export type UsePluginHookType<C = unknown> = (
  props: PluginPropsInterface<C>
) => UsePluginHookReturnInterface;
