import {ThemeInterface} from '@momentum-xyz/ui-kit-storybook';

import {PluginApiInterface} from './pluginApi.interface';
import {ApiInterface} from './api.interface';

export interface PluginPropsInterface<C = unknown> {
  theme: ThemeInterface;
  objectId?: string;
  isAdmin: boolean;
  isExpanded?: boolean;

  onToggleExpand?: () => void;

  pluginApi: PluginApiInterface<C>;
  api: ApiInterface;

  onClose: () => void;
}
