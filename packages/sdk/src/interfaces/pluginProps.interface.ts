import {ThemeInterface} from '@momentum-xyz/ui-kit';

import {PluginStateApiInterface} from './pluginStateApi.interface';
import {PluginConfigInterface} from './pluginConfig.interface';
import {ApiInterface} from './api.interface';

export interface CorePluginPropsInterface<C extends PluginConfigInterface = PluginConfigInterface> {
  theme: ThemeInterface;
  spaceId?: string;
  isSpaceAdmin: boolean;

  stateApi: PluginStateApiInterface<C>;
  api: ApiInterface;
}

export interface PluginTopBarActionInterface {
  main: () => JSX.Element | null;
}

export interface SpacePluginPropsInterface<C extends PluginConfigInterface = PluginConfigInterface>
  extends CorePluginPropsInterface<C> {
  renderTopBarActions: (actions: PluginTopBarActionInterface) => void;
}
