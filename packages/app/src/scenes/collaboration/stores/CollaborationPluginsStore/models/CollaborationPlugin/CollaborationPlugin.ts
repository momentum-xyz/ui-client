import {flow, Instance, types} from 'mobx-state-tree';
import {IconNameType} from '@momentum/ui-kit';
import {RequestModel} from '@momentum/core';
import {ComponentType} from 'react';
import {PluginPropsType, PluginTypeEnum} from '@momentum/sdk';

const CollaborationPlugin = types
  .model('CollaborationPlugin', {
    name: types.string,
    subPath: types.string,
    subtitle: types.maybe(types.string),
    url: types.string,
    exact: types.maybe(types.boolean),
    module: types.maybe(types.string),
    iconName: types.frozen<IconNameType>(),

    isErrorWhileLoadingComponent: false,
    Component: types.maybe(types.frozen<ComponentType<PluginPropsType>>()),

    request: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    init: flow(function* () {
      self.isErrorWhileLoadingComponent = false;

      try {
        const plugin = yield (async (): Promise<ComponentType<PluginPropsType>> => {
          // @ts-ignore: Required to load list based plugins, no ts declaration
          await __webpack_init_sharing__('default');
          // @ts-ignore: Required to load list based plugins, window has no dict based declaration
          const container = window[self.name];
          // @ts-ignore: Required to load list based plugins, cause window[scope] does not produce a type
          await container.init(__webpack_share_scopes__.default);
          // @ts-ignore: Required to load list based plugins, cause of previous problems
          const plugin = (await window[self.name].get('./Plugin'))().default;
          // @ts-ignore: Required to load list based plugins, cause of previous problems
          return plugin[`${PluginTypeEnum.SPACE}Extension`];
        })();
        self.Component = plugin;
      } catch {
        self.isErrorWhileLoadingComponent = true;
      }
    })
  }));

export interface CollaborationPluginInterface extends Instance<typeof CollaborationPlugin> {}

export {CollaborationPlugin};
