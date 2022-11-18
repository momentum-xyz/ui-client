import {types, cast, flow} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {PluginInterface} from 'core/interfaces';
import {
  DynamicScriptLoaderType,
  PluginAttributesManager,
  PluginLoader,
  PluginLoaderModelType,
  SearchQuery
} from 'core/models';
import {DynamicScriptsStore, PluginQueryResult} from 'stores/MainStore/models';
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
      searchedPlugins: types.array(PluginQueryResult),
      searchQuery: types.optional(SearchQuery, {}),

      dynamicScriptsStore: types.optional(DynamicScriptsStore, {}),

      pluginsListRequest: types.optional(RequestModel, {}),
      pluginMetadataRequest: types.optional(RequestModel, {}),
      pluginOptionsRequest: types.optional(RequestModel, {}),
      addPluginRequest: types.optional(RequestModel, {}),
      removePluginRequest: types.optional(RequestModel, {}),
      searchPluginsRequest: types.optional(RequestModel, {})
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

      const pluginIds = spaceOptions[SpaceSubOptionKeyEnum.Asset2DPlugins] as string[];

      if (pluginIds.length === 0) {
        self.spacePluginLoaders = cast([]);
        return;
      }

      const [pluginsMetadata, pluginsOptions] = yield Promise.all([
        self.pluginMetadataRequest.send(api.pluginsRepository.getPluginsMetadata, {ids: pluginIds}),
        self.pluginOptionsRequest.send(api.pluginsRepository.getPluginsOptions, {ids: pluginIds})
      ]);

      const pluginsDetailsList = Object.entries(
        pluginsMetadata as GetPluginsMetadataResponse
      ).map<PluginInterface>(([plugin_uuid, metadata]) => {
        const options = (pluginsOptions as GetPluginsOptionsResponse)[plugin_uuid];

        return {
          id: plugin_uuid,
          ...options,
          ...metadata,
          scriptUrl: 'http://localhost:3001/remoteEntry.js'
        };
      });

      const plugins: PluginLoaderModelType[] = [];
      for (const plugin of pluginsDetailsList) {
        try {
          const pluginLoader = PluginLoader.create({
            ...plugin,
            attributesManager: PluginAttributesManager.create({
              pluginId: plugin.id,
              spaceId
            })
          });

          plugins.push(pluginLoader);
        } catch (err) {
          console.log('Error parsing plugin', plugin, ' - ignore it. Error:', err);
        }
      }

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
    searchPlugins: flow(function* () {
      const {query} = self.searchQuery;

      if (query.length === 0) {
        self.searchedPlugins = cast([]);
        return;
      }

      // TODO: Uncomment type when ready on BE
      const response: GetPluginsListResponse | undefined = yield self.searchPluginsRequest.send(
        api.pluginsRepository.searchPlugins,
        {name: query, description: query /*, type: PluginTypeEnum.PLUGIN_2D */}
      );

      if (response) {
        const plugins = Object.entries(response).map(([plugin_uuid, plugin_name]) => ({
          plugin_uuid,
          plugin_name
        }));

        self.searchedPlugins = cast(plugins);
      }
    })
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

      return self.removePluginRequest.isDone;
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
    },
    get isRemovePluginPeding(): boolean {
      return self.removePluginRequest.isPending;
    }
  }));

export {PluginsStore};
