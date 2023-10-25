import {PluginPropsInterface} from './pluginProps.interface';

export interface EditObjectViewInterface {
  onSave: () => void;
}

export interface UsePluginHookReturnInterface {
  content?: JSX.Element | null;
  objectView?: {
    title?: string;
    subtitle?: string;
    actions?: JSX.Element | null;
    content: JSX.Element | null;
    isModified?: boolean;
    isValid?: boolean;
    isEmpty?: boolean;
    isLoading?: boolean;
    editModeContent?: JSX.Element | null;
    saveChanges?: () => Promise<void>;
    discardChanges?: () => void;
    remove?: () => Promise<void>;
  };
  creatorTab?: {
    title?: string;
    icon?: string;
    content: JSX.Element | null;
    onOpen?: () => void;
    onClose?: () => void;
  };
}

export type UsePluginHookType<C = unknown> = (
  props: PluginPropsInterface<C>
) => UsePluginHookReturnInterface;
