import {AxiosInstance} from 'axios';

import {ThemeInterface} from 'ui-kit';

// TODO: Export it to a shared package so that plugins can use it.
export interface PluginPropsInterface {
  theme: ThemeInterface;
  spaceId?: string;
  isSpaceAdmin: boolean;
  request?: AxiosInstance;
}

export interface PluginTopBarActionInterface {
  main: () => JSX.Element | null;
}

export interface CollaboarationPluginPropsInterface extends PluginPropsInterface {
  renderTopBarActions?: (actions: PluginTopBarActionInterface) => void;
}

export type PluginPropsType = PluginPropsInterface | CollaboarationPluginPropsInterface;
