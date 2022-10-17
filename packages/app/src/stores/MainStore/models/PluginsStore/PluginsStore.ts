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
    getSpacePlugins() {
      // TODO: Later change it to API call that returns this list

      COLLABORATION_PLUGIN_LIST.forEach((plugin) => {
        if (self.dynamicScriptsStore.containsLoaderWithName(plugin.name)) {
          return;
        }

        self.dynamicScriptsStore.addScript(plugin.name, plugin.url);
      });

      self.spacePluginLoaders = cast(COLLABORATION_PLUGIN_LIST);
    },
    canLoadPlugin(name: string) {
      const dynamicScript = self.dynamicScriptsStore.getScript(name);

      return dynamicScript?.isLoaded;
    },
    addPlugin(plugin: PluginInterface) {
      // TODO: Later change it to API call adds plugin
      if (!self.dynamicScriptsStore.containsLoaderWithName(plugin.name)) {
        self.dynamicScriptsStore.addScript(plugin.name, plugin.url);
      }

      const newPlugins = [...self.spacePluginLoaders, plugin];
      self.spacePluginLoaders = cast(newPlugins);
    },
    removePlugin(subpath: string) {
      self.spacePluginLoaders = cast(
        self.spacePluginLoaders.filter((loader) => loader.subPath !== subpath)
      );
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
