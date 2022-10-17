import {flow, Instance, types} from 'mobx-state-tree';
import {IconNameType} from '@momentum-xyz/ui-kit';
import {PluginInterface} from '@momentum-xyz/sdk';
import {ResetModel} from '@momentum-xyz/core';

const PluginLoader = types
  .compose(
    ResetModel,
    types.model('PluginLoader', {
      name: types.string,
      subPath: types.string,
      subtitle: types.maybe(types.string),
      url: types.string,
      exact: types.maybe(types.boolean),
      module: types.maybe(types.string),
      iconName: types.frozen<IconNameType>(),

      isError: false,
      plugin: types.maybe(types.frozen<PluginInterface>())
    })
  )
  .actions((self) => ({
    loadPlugin: flow(function* () {
      if (self.plugin) {
        return;
      }

      self.isError = false;

      try {
        self.plugin = yield (async (): Promise<PluginInterface> => {
          // @ts-ignore: Required to load list based plugins, no ts declaration
          await __webpack_init_sharing__('default');
          // @ts-ignore: Required to load list based plugins, window has no dict based declaration
          const container = window[self.name];
          // @ts-ignore: Required to load list based plugins, cause window[scope] does not produce a type
          await container.init(__webpack_share_scopes__.default);
          // @ts-ignore: Required to load list based plugins, cause of previous problems
          const plugin = (await window[self.name].get('./Plugin'))().default;
          // @ts-ignore: Required to load list based plugins, cause of previous problems
          return plugin;
        })();
      } catch {
        console.error('[PluginLoader] Error while loading plugin!');
        self.isError = true;
      }
    })
  }));

export type PluginLoaderModelType = Instance<typeof PluginLoader>;

export {PluginLoader};
