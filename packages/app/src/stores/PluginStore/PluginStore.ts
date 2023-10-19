import {types, flow, cast} from 'mobx-state-tree';
import {RequestModel} from '@momentum-xyz/core';

import {api} from 'api';
import {DynamicScriptList, MediaUploader, PluginAttributesManager, PluginLoader} from 'core/models';
import {getRootStore} from 'core/utils';

interface PluginInfoInterface {
  plugin_id: string;
  meta: any;
  options?: any;
  created_at?: string;
  updated_at?: string;
}

const localPluginInfosByScopes = {
  creatorTab: [
    {
      plugin_id: '99c9a0ba-0c19-4ef5-a995-9bc3af39a0a5',
      meta: {
        name: 'plugin_odyssey_creator_openai',
        scopeName: 'plugin_odyssey_creator_openai',
        scriptUrl: 'http://localhost:3001/remoteEntry.js'
      }
    }
  ]
};

export const PluginStore = types
  .model('PluginStore', {
    dynamicScriptList: types.optional(DynamicScriptList, {}),
    pluginInfosByScopes: types.optional(
      types.frozen<Record<string, PluginInfoInterface[]>>({}),
      {}
    ),
    // pluginsLoadersByIds: types.optional(types.frozen<Record<string, typeof PluginLoader>>({})), {}),
    pluginsLoadersByIds: types.map(PluginLoader),
    pluginLoadersByScopes: types.map(types.array(types.reference(PluginLoader))),

    // pluginLoadersByScopes: types.optional(
    //   types.frozen<Record<string, typeof PluginLoader>>({}),
    //   {}
    // ),

    _plugins: types.optional(types.frozen<PluginInfoInterface[]>(), []),

    pluginsRequest: types.optional(RequestModel, {}),
    mediaUploader: types.optional(MediaUploader, {})
  })
  .actions((self) => ({
    init: flow(function* () {
      // init: function () {
      const pluginsResponse = yield self.pluginsRequest.send(
        api.pluginsRepository.getPluginsList,
        {}
      );
      console.log('pluginsResponse', pluginsResponse);
      self._plugins = pluginsResponse || [];

      // if (pluginsResponse) {
      // self.pluginInfosByScopes = pluginsResponse.plugins;
      self.pluginInfosByScopes = localPluginInfosByScopes;
      // }
    }),
    storePluginLoadersByScope: (scope: string, pluginLoaders: any[]) => {
      self.pluginLoadersByScopes.set(scope, cast(pluginLoaders));
      for (const plugin of pluginLoaders) {
        self.pluginsLoadersByIds.set(plugin.pluginId, plugin);
      }
    }
  }))
  .actions((self) => ({
    preloadPluginsByScope: flow(function* (scope: string) {
      console.log('getPluginsByScope', scope);
      const pluginInfos = self.pluginInfosByScopes[scope] || [];
      const plugins = yield Promise.all(
        pluginInfos.map(async ({plugin_id, meta, options}) => {
          console.log('get plugin ', {plugin_id, meta, options});
          const preloaded = self.pluginsLoadersByIds.get(plugin_id);
          if (preloaded) {
            return preloaded;
          }
          try {
            console.log('create plugin ', {plugin_id, meta, options});

            if (!self.dynamicScriptList.containsLoaderWithName(meta.scopeName)) {
              await self.dynamicScriptList.addScript(meta.scopeName, meta.scriptUrl);
            }

            const worldId = getRootStore(self).universeStore.worldId;

            const pluginLoader = PluginLoader.create({
              id: plugin_id,
              pluginId: plugin_id,
              ...options,
              ...meta,
              attributesManager: PluginAttributesManager.create({
                pluginId: plugin_id,
                worldId
              })
            });

            console.log('load plugin ', {plugin_id, meta, options});

            await pluginLoader.loadPlugin();

            console.log('loaded plugin ', {plugin_id, meta, options});

            // self.pluginsLoadersByIds.set(plugin_id, pluginLoader);

            console.log('pluginLoader', pluginLoader);

            return pluginLoader;
          } catch (e) {
            console.error('Error loading plugin', plugin_id, e);
            return null;
          }
        })
      );
      const loadedPlugins = plugins.filter((plugin: any) => !!plugin);
      // self.pluginLoadersByScopes.set(scope, cast(loadedPlugins));
      self.storePluginLoadersByScope(scope, loadedPlugins);

      return loadedPlugins;
    })
  }))
  .views((self) => ({
    pluginsByScope(scope: string) {
      return self.pluginLoadersByScopes.get(scope) || [];
    },
    get plugins() {
      return self._plugins.filter((plugin) => !!plugin.meta.scopeName);
    }
  }));
