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
      const value: T | undefined = yield self.getStateRequest.send(
        api.spaceAttributeRepository.getSpaceSubAttribute,
        {
          worldId,
          spaceId,
          plugin_id: self.pluginId,
          attribute_name: 'state',
          sub_attribute_key: key
        }
      );

      if (value === undefined) {
        return null;
      }

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

      if (value === null) {
        yield self.setStateRequest.send(api.spaceAttributeRepository.deleteSpaceSubAttribute, {
          worldId,
          spaceId,
          plugin_id: self.pluginId,
          attribute_name: 'state',
          sub_attribute_key: key
        });
      } else {
        yield self.setStateRequest.send(api.spaceAttributeRepository.setSpaceSubAttribute, {
          worldId,
          spaceId,
          plugin_id: self.pluginId,
          attribute_name: 'state',
          sub_attribute_key: key,
          value: value
        });
      }
    })
  }))
  .views((self) => ({
    getAPI(worldId: string, spaceId: string): APIInterface {
      return {
        get: async <T>(key: string) => {
          const result = await self.get(worldId, spaceId, key);
          return result as T;
        },
        set: (key, value) => self.set(worldId, spaceId, key, value)
      };
    }
  }));

export type PluginAttributesManagerType = Instance<typeof PluginAttributesManager>;

export {PluginAttributesManager};
