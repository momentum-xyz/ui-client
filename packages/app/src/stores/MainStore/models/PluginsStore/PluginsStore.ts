import {types, cast, flow} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {PluginInterface} from 'core/interfaces';
import {
  DynamicScriptLoaderType,
  PluginAttributesManager,
  PluginLoader,
  PluginLoaderModelType
} from 'core/models';
import {DynamicScriptsStore} from 'stores/MainStore/models';
import {
  api,
  GetPluginsMetadataResponse,
  GetPluginsOptionsResponse,
  GetSpaceOptionsResponse
} from 'api';

const PluginsStore = types
  .compose(
    ResetModel,
    types.model('PluginsStore', {
      spacePluginLoaders: types.array(PluginLoader),

      dynamicScriptsStore: types.optional(DynamicScriptsStore, {}),

      pluginsListRequest: types.optional(RequestModel, {}),
      pluginMetadataRequest: types.optional(RequestModel, {}),
      pluginOptionsRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    fetchSpacePlugins: flow(function* (worldId: string, spaceId: string) {
      const spaceOptions: GetSpaceOptionsResponse = yield self.pluginsListRequest.send(
        api.spaceOptionRepository.getSpaceOptions,
        {
          worldId,
          spaceId
        }
      );

      const plugin_uuids = spaceOptions['plugins'] as string[];

      const [pluginsMetadata, pluginsOptions] = yield Promise.all([
        self.pluginMetadataRequest.send(api.pluginsRepository.getPluginsMetadata, {plugin_uuids}),
        self.pluginOptionsRequest.send(api.pluginsRepository.getPluginsOptions, {plugin_uuids})
      ]);

      const plugins = Object.entries(pluginsMetadata as GetPluginsMetadataResponse)
        .map<PluginInterface>(([plugin_uuid, metadata]) => {
          const options = (pluginsOptions as GetPluginsOptionsResponse)[plugin_uuid];

          return {
            id: plugin_uuid,
            ...options,
            ...metadata
          };
        })
        .map((plugin) =>
          PluginLoader.create({
            ...plugin,
            attributesManager: PluginAttributesManager.create({pluginId: plugin.id})
          })
        );

      self.spacePluginLoaders = cast(plugins);
    }),
    loadPluginIfNeeded(pluginLoader: PluginLoaderModelType) {
      if (pluginLoader.isLoaded || pluginLoader.isLoading) {
        return;
      }

      console.log('Loading plugin');
      const dynamicScript = self.dynamicScriptsStore.getScript(pluginLoader.scopeName);

      if (dynamicScript?.isLoaded && pluginLoader.isReady) {
        pluginLoader.loadPlugin();
      }
    }
  }))
  .views((self) => ({
    get spacePlugins(): PluginLoaderModelType[] {
      const plugins = self.spacePluginLoaders.filter((pluginLoader) =>
        self.dynamicScriptsStore.containsLoaderWithName(pluginLoader.scopeName)
      );

      return plugins;
    },
    get scripts(): DynamicScriptLoaderType[] {
      return self.dynamicScriptsStore.loaders;
    }
  }));

export {PluginsStore};
