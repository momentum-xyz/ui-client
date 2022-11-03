import {RequestModel} from '@momentum-xyz/core';
import {APIInterface} from '@momentum-xyz/sdk';
import {flow, Instance, types} from 'mobx-state-tree';

import {api} from 'api';
import {AttributeNameEnum} from 'api/enums';

const PluginAttributesManager = types
  .model('PluginAttributesManager', {
    pluginId: types.string,
    spaceId: types.string,

    getStateRequest: types.optional(RequestModel, {}),
    setStateRequest: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    get: flow(function* <T>(spaceId: string, key: string) {
      const response = yield self.getStateRequest.send(
        api.spaceAttributeRepository.getSpaceSubAttribute,
        {
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
    set: flow(function* <T>(spaceId: string, key: string, value: T extends undefined ? never : T) {
      if (!self.pluginId) {
        return;
      }

      const repiository = api.spaceAttributeRepository;

      yield self.setStateRequest.send(
        value === null ? repiository.deleteSpaceSubAttribute : repiository.setSpaceSubAttribute,
        {
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
    get api(): APIInterface {
      return {
        get: async <T>(key: string) => {
          const result = await self.get(self.spaceId, key);
          return result as T;
        },
        set: (key, value) => self.set(self.spaceId, key, value)
      };
    }
  }));

export type PluginAttributesManagerType = Instance<typeof PluginAttributesManager>;

export {PluginAttributesManager};
