import {ThemeInterface} from '@momentum-xyz/ui-kit';

import {PluginStateInterface} from './pluginState.interface';

export interface CorePluginPropsInterface {
  theme: ThemeInterface;
  spaceId?: string;
  isSpaceAdmin: boolean;

  pluginState: PluginStateInterface;
  init: (options: {fields: string[]}) => Promise<void>;
  reload: () => Promise<void>;
  setPluginState: <V>(key: string, value: V) => Promise<void>;
}

export interface PluginTopBarActionInterface {
  main: () => JSX.Element | null;
}

export interface SpacePluginPropsInterface extends CorePluginPropsInterface {
  renderTopBarActions?: (actions: PluginTopBarActionInterface) => void;
}
