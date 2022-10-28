import {ThemeInterface} from '@momentum-xyz/ui-kit';

import {APIInterface} from './api.interface';

export interface CorePluginPropsInterface {
  theme: ThemeInterface;
  spaceId?: string;
  isSpaceAdmin: boolean;

  api: APIInterface;
}

export interface PluginTopBarActionInterface {
  main: () => JSX.Element | null;
}

export interface SpacePluginPropsInterface extends CorePluginPropsInterface {
  renderTopBarActions?: (actions: PluginTopBarActionInterface) => void;
}
