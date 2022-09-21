import {AxiosInstance} from 'axios';

import {ThemeInterface} from 'ui-kit';

export interface PluginConfigInterface {
  theme: ThemeInterface;
  appId: string;
  spaceId?: string;
  isSpaceAdmin: boolean;
  request: AxiosInstance;
}
