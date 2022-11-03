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
  GetPluginsListResponse,
  GetPluginsMetadataResponse,
  GetPluginsOptionsResponse,
  SpaceSubOptionResponse
} from 'api';
import {SpaceSubOptionKeyEnum} from 'api/enums';

const PluginsStore = types
  .compose(
    ResetModel,
    types.model('PluginsStore', {
      spacePluginLoaders: types.array(PluginLoader),
      allPlugins: types.optional(types.frozen<GetPluginsListResponse>(), {}),

      dynamicScriptsStore: types.optional(DynamicScriptsStore, {}),

      pluginsListRequest: types.optional(RequestModel, {}),
      pluginMetadataRequest: types.optional(RequestModel, {}),
      pluginOptionsRequest: types.optional(RequestModel, {}),
      addPluginRequest: types.optional(RequestModel, {}),
      removePluginRequest: types.optional(RequestModel, {}),
      getAllPluginsRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    fetchSpacePlugins: flow(function* (spaceId: string) {
      const spaceOptions: SpaceSubOptionResponse = yield self.pluginsListRequest.send(
        api.spaceOptionRepository.getSpaceSubOption,
        {
          spaceId,
          sub_option_key: SpaceSubOptionKeyEnum.Asset2DPlugins
        }
      );

      if (!spaceOptions) {
        return;
      }

      const plugin_uuids = spaceOptions[SpaceSubOptionKeyEnum.Asset2DPlugins] as string[];

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
            attributesManager: PluginAttributesManager.create({
              pluginId: plugin.id,
              spaceId
            })
          })
        );

      plugins.forEach((plugin) => {
        if (!self.dynamicScriptsStore.containsLoaderWithName(plugin.scopeName)) {
          self.dynamicScriptsStore.addScript(plugin.scopeName, plugin.scriptUrl);
        }
      });

      self.spacePluginLoaders = cast(plugins);
    }),
    loadPluginIfNeeded(pluginLoader: PluginLoaderModelType, isDynamicScriptLoaded: boolean) {
      if (pluginLoader.isLoaded || pluginLoader.isLoading) {
        return;
      }

      if (isDynamicScriptLoaded && pluginLoader.isReady) {
        pluginLoader.loadPlugin();
      }
    },
    fetchAllPlugins: flow(function* () {
      self.allPlugins = yield self.getAllPluginsRequest.send(
        api.pluginsRepository.getPluginsList,
        {}
      );
    }),
    resetAllPlugins() {
      self.allPlugins = {};
    }
  }))
  .actions((self) => ({
    addPluginToSpace: flow(function* (spaceId: string, pluginId: string) {
      yield self.addPluginRequest.send(api.spaceOptionRepository.setSpaceSubOption, {
        spaceId,
        sub_option_key: SpaceSubOptionKeyEnum.Asset2DPlugins,
        value: [...self.spacePluginLoaders.map((loader) => loader.id), pluginId]
      });

      yield self.fetchSpacePlugins(spaceId);
    }),
    removePluginFromSpace: flow(function* (spaceId: string, pluginId: string) {
      yield self.removePluginRequest.send(api.spaceOptionRepository.setSpaceSubOption, {
        spaceId,
        sub_option_key: SpaceSubOptionKeyEnum.Asset2DPlugins,
        value: self.spacePluginLoaders.map((loader) => loader.id).filter((id) => id !== pluginId)
      });

      yield self.fetchSpacePlugins(spaceId);
    })
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
