import {ThemeInterface} from '@momentum-xyz/ui-kit';

import {APIInterface} from './api.interface';
import {PluginConfigInterface} from './pluginConfig.interface';

export interface CorePluginPropsInterface<C extends PluginConfigInterface> {
  theme: ThemeInterface;
  spaceId?: string;
  isSpaceAdmin: boolean;

  api: APIInterface<C>;
}

export interface PluginTopBarActionInterface {
  main: () => JSX.Element | null;
}

export interface SpacePluginPropsInterface<C extends PluginConfigInterface>
  extends CorePluginPropsInterface<C> {
  renderTopBarActions?: (actions: PluginTopBarActionInterface) => void;
}
