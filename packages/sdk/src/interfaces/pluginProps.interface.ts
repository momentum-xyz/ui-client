import {ThemeInterface} from '@momentum-xyz/ui-kit';

import {PluginStateInterface} from './pluginState.interface';

export interface CorePluginPropsInterface {
  theme: ThemeInterface;
  spaceId?: string;
  isSpaceAdmin: boolean;
}

export interface PluginTopBarActionInterface {
  main: () => JSX.Element | null;
}

export interface SpacePluginPropsInterface extends CorePluginPropsInterface {
  init: (fields: string[]) => Promise<void>;
  spacePluginState: PluginStateInterface;
  setPluginSpaceStateSubField: <V>(
    field: string,
    subField: string,
    subFieldValue: V
  ) => Promise<void>;
  renderTopBarActions?: (actions: PluginTopBarActionInterface) => void;
}
