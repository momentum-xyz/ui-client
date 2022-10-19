import {flow, Instance, types} from 'mobx-state-tree';
import {IconNameType} from '@momentum-xyz/ui-kit';
import {PluginInterface} from '@momentum-xyz/sdk';
import {ResetModel} from '@momentum-xyz/core';

import {LoaderStatusEnum} from 'core/enums';

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
      status: types.optional(
        types.enumeration(Object.values(LoaderStatusEnum)),
        LoaderStatusEnum.READY
      ),
      plugin: types.maybe(types.frozen<PluginInterface>())
    })
  )
  .actions((self) => ({
    loadPlugin: flow(function* () {
      if (self.plugin) {
        return;
      }

      self.status = LoaderStatusEnum.LOADING;

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

        self.status = LoaderStatusEnum.LOADED;
      } catch (error) {
        console.error('[PluginLoader] An error has occured while loading plugin!', error);
        self.status = LoaderStatusEnum.ERROR;
      }
    })
  }))
  .views((self) => ({
    get isLoaded(): boolean {
      return self.status === LoaderStatusEnum.LOADED && !!self.plugin;
    },
    get isError(): boolean {
      return self.status === LoaderStatusEnum.ERROR;
    },
    get isLoading(): boolean {
      return self.status === LoaderStatusEnum.LOADING;
    },
    get isReady(): boolean {
      return self.status === LoaderStatusEnum.READY;
    }
  }));

export type PluginLoaderModelType = Instance<typeof PluginLoader>;

export {PluginLoader};
