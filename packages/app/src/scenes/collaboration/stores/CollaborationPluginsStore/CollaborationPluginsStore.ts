import {types, cast} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {appVariables} from 'api/constants';
import {PluginInterface} from 'core/interfaces';
import {PluginLoader} from 'core/models';

const COLLABORATION_PLUGIN_LIST: PluginInterface[] = [
  {
    name: 'plugin_miro',
    subPath: 'miro',
    subtitle: 'Miro document',
    iconName: 'miro',
    // TODO: Later change to remote url
    url: appVariables.IS_DEV_ENVIRONMENT
      ? 'http://localhost:3001/remoteEntry.js'
      : ' https://dev.odyssey.ninja/plugins/miro/remoteEntry.js',
    exact: true
  }
];

const CollaboarationPluginStore = types
  .compose(
    ResetModel,
    types.model('CollaboarationPluginStore', {
      pluginLoaders: types.array(PluginLoader)
    })
  )
  .actions((self) => ({
    init() {
      // TODO: Later change it to API call that returns this list
      self.pluginLoaders = cast(COLLABORATION_PLUGIN_LIST);
    },
    addPlugin(plugin: PluginInterface) {
      // TODO: Later change it to API call adds plugin
      const newPlugins = [...self.pluginLoaders, plugin];
      self.pluginLoaders = cast(newPlugins);
    },
    removePlugin(name: string) {
      self.pluginLoaders = cast(self.pluginLoaders.filter((loader) => loader.name !== name));
    }
  }));

export {CollaboarationPluginStore};
