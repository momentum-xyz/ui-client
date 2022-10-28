import {RequestModel} from '@momentum-xyz/core';
import {APIInterface} from '@momentum-xyz/sdk';
import {flow, Instance, types} from 'mobx-state-tree';

import {api} from 'api';

const PluginAttributesManager = types
  .model('PluginAttributesManager', {
    pluginId: types.string,

    getStateRequest: types.optional(RequestModel, {}),
    setStateRequest: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    get: flow(function* <T>(worldId: string, spaceId: string, key: string) {
      const value: T = yield self.getStateRequest.send(
        api.spaceAttributeRepository.getSpaceSubAttribute,
        {
          worldId,
          spaceId,
          plugin_id: self.pluginId,
          attribute_name: 'state',
          sub_attribute_key: key
        }
      );

      return value;
    }),
    set: flow(function* <T>(
      worldId: string,
      spaceId: string,
      key: string,
      value: T extends undefined ? never : T
    ) {
      if (!self.pluginId) {
        return;
      }

      yield self.setStateRequest.send(api.spaceAttributeRepository.setSpaceSubAttribute, {
        worldId,
        spaceId,
        plugin_id: self.pluginId,
        attribute_name: 'state',
        sub_attribute_key: key,
        value: value
      });
    }),
    getAPI(worldId: string, spaceId?: string): APIInterface {
      if (!spaceId) {
        return {
          get: () => Promise.reject('[PluginAttributesManager] Get function is not defined'),
          set: () => Promise.reject('[PluginAttributesManager] Set function is not defined')
        };
      }

      return {
        get: async <T>(key: string) => {
          const result = await this.get(worldId, spaceId, key);
          return result as T;
        },
        set: (key, value) => this.set(worldId, spaceId, key, value)
      };
    }
  }));

export type PluginAttributesManagerType = Instance<typeof PluginAttributesManager>;

export {PluginAttributesManager};
