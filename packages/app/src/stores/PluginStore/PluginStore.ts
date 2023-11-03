import {types, flow, cast} from 'mobx-state-tree';
import {RequestModel} from '@momentum-xyz/core';

import {api} from 'api';
import {DynamicScriptList, MediaUploader, PluginAttributesManager, PluginLoader} from 'core/models';
import {getPluginAbsoluteUrl, getRootStore} from 'core/utils';

interface PluginInfoInterface {
  plugin_id: string;
  meta: any;
  options?: any;
  created_at?: string;
  updated_at?: string;
}

const localPluginInfosByScopes: Record<string, PluginInfoInterface[]> = {
  // creatorTab: [
  //   {
  //     plugin_id: '018b5c08-a574-7288-91cd-90a5e459f04d',
  //     meta: {
  //       name: 'plugin_odyssey_creator_openai',
  //       scopeName: 'plugin_odyssey_creator_openai',
  //       scriptUrl: 'http://localhost:3001/remoteEntry.js'
  //     }
  //   }
  // ]
};

export const PluginStore = types
  .model('PluginStore', {
    dynamicScriptList: types.optional(DynamicScriptList, {}),
    pluginInfosByScopes: types.optional(
      types.frozen<Record<string, PluginInfoInterface[]>>({}),
      {}
    ),
    pluginsLoadersByIds: types.map(PluginLoader),
    pluginLoadersByScopes: types.map(types.array(types.reference(PluginLoader))),

    _plugins: types.optional(types.frozen<PluginInfoInterface[]>(), []),

    pluginsRequest: types.optional(RequestModel, {}),
    mediaUploader: types.optional(MediaUploader, {})
  })
  .actions((self) => ({
    init: flow(function* () {
      const pluginsResponse = yield self.pluginsRequest.send(
        api.pluginsRepository.getPluginsList,
        {}
      );
      console.log('pluginsResponse', pluginsResponse);
      self._plugins = pluginsResponse || [];

      if (pluginsResponse) {
        const pluginInfosByScopes: Record<string, PluginInfoInterface[]> = {};
        for (const p of pluginsResponse) {
          if (Array.isArray(p.meta?.scopes?.ui)) {
            for (const scope of p.meta.scopes.ui) {
              if (!pluginInfosByScopes[scope]) {
                pluginInfosByScopes[scope] = [];
              }
              pluginInfosByScopes[scope].push(p);
            }
          }
        }

        // for local dev
        for (const scope in localPluginInfosByScopes) {
          if (!pluginInfosByScopes[scope]) {
            pluginInfosByScopes[scope] = [];
          }
          for (const localPluginInfosByScope of localPluginInfosByScopes[scope]) {
            const existingIndex = pluginInfosByScopes[scope].findIndex(
              (p) => p.plugin_id === localPluginInfosByScope.plugin_id
            );
            if (existingIndex !== -1) {
              pluginInfosByScopes[scope][existingIndex] = localPluginInfosByScope;
            } else {
              pluginInfosByScopes[scope].push(localPluginInfosByScope);
            }
          }
        }

        self.pluginInfosByScopes = pluginInfosByScopes;
      }
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
              const scriptUrl = getPluginAbsoluteUrl(meta.scriptUrl)!;
              console.log('Load plugin', plugin_id, 'from scriptUrl', scriptUrl);
              await self.dynamicScriptList.addScript(meta.scopeName, scriptUrl);
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
            console.log('pluginLoader', pluginLoader);

            return pluginLoader;
          } catch (e) {
            console.error('Error loading plugin', plugin_id, e);
            return null;
          }
        })
      );
      const loadedPlugins = plugins.filter((plugin: any) => !!plugin);
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
