import {AxiosInstance} from 'axios';

import {ThemeInterface} from 'ui-kit/interfaces';

// TODO: Export it to a shared package so that plugins can use it.
export interface CorePluginPropsInterface {
  theme: ThemeInterface;
  spaceId?: string;
  isSpaceAdmin: boolean;
  request?: AxiosInstance;
}

export interface PluginTopBarActionInterface {
  main: () => JSX.Element | null;
}

export interface SpacePluginPropsInterface extends CorePluginPropsInterface {
  renderTopBarActions?: (actions: PluginTopBarActionInterface) => void;
}

export type PluginPropsType = CorePluginPropsInterface | SpacePluginPropsInterface;
