import {AxiosInstance} from 'axios';

import {ThemeInterface} from 'ui-kit';

// TODO: Export it to a shared package so that plugins can use it.
export interface PluginConfigInterface {
  theme: ThemeInterface;
  spaceId?: string;
  isSpaceAdmin: boolean;
  request: AxiosInstance;
}
