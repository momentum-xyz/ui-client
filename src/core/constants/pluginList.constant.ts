import {PluginInterface} from 'core/interfaces/plugin.interface';
import {ThemeInterface} from 'ui-kit';

import {ROUTES} from './routePaths.constants';

// This list later could be passed as parameters from API
export const PLUGIN_LIST: (
  theme: ThemeInterface,
  appId: string,
  isSpaceAdmin: boolean,
  spaceId?: string
) => PluginInterface[] = (theme, appId, isSpaceAdmin, spaceId) => [
  {
    name: 'miro_plugin',
    iconName: 'miro',
    // TODO: Later change to remote url
    url: 'http://localhost:3001/remoteEntry.js',
    path: ROUTES.collaboration.miro,
    exact: true,
    config: {
      theme,
      appId,
      isSpaceAdmin,
      spaceId
    }
  }
];
