import {PluginConfigInterface} from 'core/interfaces';
import {PluginInterface} from 'core/interfaces/plugin.interface';

import {ROUTES} from './routePaths.constants';

// This list later could be passed as parameters from API
export const PLUGIN_LIST: (config: PluginConfigInterface) => PluginInterface[] = (config) => [
  {
    name: 'miro_plugin',
    iconName: 'miro',
    // TODO: Later change to remote url
    url: 'http://localhost:3001/remoteEntry.js',
    path: ROUTES.collaboration.miro,
    exact: true,
    config
  }
];
