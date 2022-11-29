import {ThemeInterface} from '@momentum-xyz/ui-kit';

import {PluginApiInterface} from './pluginApi.interface';
import {PluginConfigInterface} from './pluginConfig.interface';
import {ApiInterface} from './api.interface';

export interface CorePluginPropsInterface<C extends PluginConfigInterface = PluginConfigInterface> {
  theme: ThemeInterface;
  objectId?: string;
  pluginName?: string;
  isAdmin: boolean;
  isExpanded?: boolean;

  onToggleExpand?: () => void;

  pluginApi: PluginApiInterface<C>;
  api: ApiInterface;
}

export interface ObjectPluginPropsInterface<C extends PluginConfigInterface = PluginConfigInterface>
  extends CorePluginPropsInterface<C> {
  onClose?: () => void;
}
