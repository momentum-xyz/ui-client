import {types, cast} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {appVariables} from 'api/constants';
import {PluginInterface} from 'core/interfaces';
import {DynamicScriptLoaderType, PluginLoader, PluginLoaderModelType} from 'core/models';
import {DynamicScriptsStore} from 'stores/MainStore/models';

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

const PluginsStore = types
  .compose(
    ResetModel,
    types.model('PluginsStore', {
      spacePluginLoaders: types.array(PluginLoader),
      dynamicScriptsStore: types.optional(DynamicScriptsStore, {})
    })
  )
  .actions((self) => ({
    fetchSpacePlugins() {
      // TODO: Later change it to API call that returns this list

      COLLABORATION_PLUGIN_LIST.forEach((plugin) => {
        if (self.dynamicScriptsStore.containsLoaderWithName(plugin.name)) {
          return;
        }

        self.dynamicScriptsStore.addScript(plugin.name, plugin.url);
      });

      self.spacePluginLoaders = cast(COLLABORATION_PLUGIN_LIST);
    },
    loadPluginIfNeeded(pluginLoader: PluginLoaderModelType) {
      if (pluginLoader.isLoaded || pluginLoader.isLoading) {
        return;
      }

      console.log('Loading plugin');
      const dynamicScript = self.dynamicScriptsStore.getScript(pluginLoader.name);

      if (dynamicScript?.isLoaded && pluginLoader.isReady) {
        pluginLoader.loadPlugin();
      }
    }
  }))
  .views((self) => ({
    get spacePlugins(): PluginLoaderModelType[] {
      const plugins = self.spacePluginLoaders.filter((pluginLoader) =>
        self.dynamicScriptsStore.containsLoaderWithName(pluginLoader.name)
      );

      return plugins;
    },
    get scripts(): DynamicScriptLoaderType[] {
      return self.dynamicScriptsStore.loaders;
    }
  }));

export {PluginsStore};
