import {appVariables} from 'api/constants';
import {PluginConfigInterface} from 'core/interfaces';
import {PluginInterface} from 'core/interfaces/plugin.interface';

// This list later could be passed as parameters from API
export const PLUGIN_LIST: (config: PluginConfigInterface) => PluginInterface[] = (config) => [
  {
    name: 'miro_plugin',
    subPath: 'miro',
    subtitle: 'Miro document',
    iconName: 'miro',
    // TODO: Later change to remote url
    url: appVariables.IS_DEV_ENVIRONMENT
      ? 'http://localhost:3001/remoteEntry.js'
      : ' https://dev.odyssey.ninja/plugins/miro/remoteEntry.js',
    exact: true,
    config
  }
];
