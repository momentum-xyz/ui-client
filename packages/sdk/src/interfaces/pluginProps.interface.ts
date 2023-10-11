import {ThemeInterface} from '@momentum-xyz/ui-kit';

import {PluginApiInterface} from './pluginApi.interface';

export interface PluginPropsInterface<C = unknown> {
  theme: ThemeInterface;
  objectId?: string;
  isAdmin: boolean;
  isExpanded?: boolean;

  onToggleExpand?: () => void;

  pluginApi: PluginApiInterface<C>;

  onClose: () => void;
}
