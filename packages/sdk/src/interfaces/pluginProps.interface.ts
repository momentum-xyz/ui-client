import {ThemeInterface} from '@momentum-xyz/ui-kit';

import {PluginStateAPIInterface} from './pluginStateApi.interface';
import {PluginConfigInterface} from './pluginConfig.interface';
import {APIInterface} from './api.interface';

export interface CorePluginPropsInterface<C extends PluginConfigInterface = PluginConfigInterface> {
  theme: ThemeInterface;
  spaceId?: string;
  isSpaceAdmin: boolean;

  pluginStateAPI: PluginStateAPIInterface<C>;
  api: APIInterface;
}

export interface PluginTopBarActionInterface {
  main: () => JSX.Element | null;
}

export interface SpacePluginPropsInterface<C extends PluginConfigInterface = PluginConfigInterface>
  extends CorePluginPropsInterface<C> {
  renderTopBarActions: (actions: PluginTopBarActionInterface) => void;
}
