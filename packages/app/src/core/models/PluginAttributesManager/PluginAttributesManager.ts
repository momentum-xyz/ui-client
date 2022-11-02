import {RequestModel} from '@momentum-xyz/core';
import {APIInterface} from '@momentum-xyz/sdk';
import {flow, Instance, types} from 'mobx-state-tree';

import {api} from 'api';
import {AttributeNameEnum} from 'api/enums';

const PluginAttributesManager = types
  .model('PluginAttributesManager', {
    pluginId: types.string,

    getStateRequest: types.optional(RequestModel, {}),
    setStateRequest: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    get: flow(function* <T>(worldId: string, spaceId: string, key: string) {
      const response = yield self.getStateRequest.send(
        api.spaceAttributeRepository.getSpaceSubAttribute,
        {
          worldId,
          spaceId,
          plugin_id: self.pluginId,
          attribute_name: AttributeNameEnum.STATE,
          sub_attribute_key: key
        }
      );

      if (!response || !(key in response)) {
        return null;
      }

      const value: T extends undefined ? never : T = response[key];

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

      const repiository = api.spaceAttributeRepository;

      yield self.setStateRequest.send(
        value === null ? repiository.deleteSpaceSubAttribute : repiository.setSpaceSubAttribute,
        {
          worldId,
          spaceId,
          plugin_id: self.pluginId,
          attribute_name: AttributeNameEnum.STATE,
          sub_attribute_key: key,
          value
        }
      );
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
