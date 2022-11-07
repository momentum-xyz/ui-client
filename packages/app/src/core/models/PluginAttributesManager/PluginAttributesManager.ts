import {RequestModel} from '@momentum-xyz/core';
import {APIInterface} from '@momentum-xyz/sdk';
import {flow, Instance, types} from 'mobx-state-tree';

import {api, GetSpaceAttributeResponse} from 'api';
import {AttributeNameEnum} from 'api/enums';
import {appVariables} from 'api/constants';

const PluginAttributesManager = types
  .model('PluginAttributesManager', {
    pluginId: types.string,
    spaceId: types.string,

    getStateRequest: types.optional(RequestModel, {}),
    setStateRequest: types.optional(RequestModel, {}),
    getConfigRequest: types.optional(RequestModel, {})
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
        return null;
      }

      const repository = api.spaceAttributeRepository;

      const body = {
        spaceId,
        plugin_id: self.pluginId,
        attribute_name: AttributeNameEnum.STATE,
        sub_attribute_key: key,
        value
      };

      if (value === null) {
        return yield self.setStateRequest.send(repository.deleteSpaceSubAttribute, body);
      } else {
        return (yield self.setStateRequest.send(repository.setSpaceSubAttribute, body))[key];
      }
    }),
    getConfig: flow(function* <C extends GetSpaceAttributeResponse>() {
      const response: GetSpaceAttributeResponse | undefined = yield self.getConfigRequest.send(
        api.spaceAttributeRepository.getSpaceAttribute,
        {
          spaceId: appVariables.NODE_ID,
          plugin_id: self.pluginId,
          attribute_name: AttributeNameEnum.CONFIG
        }
      );

      if (!response) {
        return {};
      }

      return response as C;
    })
  }))
  .views((self) => ({
    get api(): APIInterface {
      return {
        get: async <T>(key: string) => {
          const result = await self.get(self.spaceId, key);
          return result as T;
        },
        set: (key, value) => self.set(self.spaceId, key, value),
        getConfig: self.getConfig
      };
    }
  }));

export type PluginAttributesManagerType = Instance<typeof PluginAttributesManager>;

export {PluginAttributesManager};
