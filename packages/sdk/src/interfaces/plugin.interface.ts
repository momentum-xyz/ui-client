import {ReactElement} from 'react';

import {UsePluginHookType} from './usePluginHook.interface';
import {PluginConfigDescriptionInterface} from './pluginConfig.interface';

export interface PluginInterface<C = unknown> {
  usePlugin: UsePluginHookType<C>;

  configuration?:
    | PluginConfigDescriptionInterface
    | ((props: {
        data: C | undefined;
        onSave: (config: C) => void;
        onCancel: () => void;
      }) => ReactElement);
}
