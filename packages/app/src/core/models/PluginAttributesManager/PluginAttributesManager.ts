import {RequestModel} from '@momentum-xyz/core';
import {PluginStateApiInterface, AttributeValueInterface, ApiInterface} from '@momentum-xyz/sdk';
import {flow, Instance, types} from 'mobx-state-tree';

import {api, GetSpaceAttributeResponse} from 'api';
import {AttributeNameEnum} from 'api/enums';
import {appVariables} from 'api/constants';

const PluginAttributesManager = types
  .model('PluginAttributesManager', {
    pluginId: types.string,
    spaceId: types.string,

    getAttributeRequest: types.optional(RequestModel, {}),
    setAttributeRequest: types.optional(RequestModel, {}),
    deleteAttributeRequest: types.optional(RequestModel, {}),

    getAttributeItemRequest: types.optional(RequestModel, {}),
    setAttributeItemRequest: types.optional(RequestModel, {}),
    deleteAttributeItemRequest: types.optional(RequestModel, {}),

    setStateRequest: types.optional(RequestModel, {}),
    deleteStateRequest: types.optional(RequestModel, {}),
    getConfigRequest: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    getSpaceAttributeValue: flow(function* <T extends AttributeValueInterface>(
      spaceId: string,
      attributeName: string
    ) {
      const response = yield self.getAttributeRequest.send(
        api.spaceAttributeRepository.getSpaceAttribute,
        {
          spaceId,
          plugin_id: self.pluginId,
          attribute_name: attributeName
        }
      );

      if (response === undefined) {
        return {} as T;
      }

      return response as T;
    }),
    setSpaceAttributeValue: flow(function* <T extends AttributeValueInterface>(
      spaceId: string,
      attributeName: string,
      value: T
    ) {
      const response = yield self.setAttributeRequest.send(
        api.spaceAttributeRepository.setSpaceAttribute,
        {
          spaceId,
          plugin_id: self.pluginId,
          attribute_name: attributeName,
          value
        }
      );

      if (response === undefined) {
        throw Error('Empty response');
      }

      return response as T;
    }),
    deleteSpaceAttribute: flow(function* (spaceId: string, attributeName: string) {
      const response = yield self.deleteAttributeRequest.send(
        api.spaceAttributeRepository.deleteSpaceAttribute,
        {
          spaceId,
          plugin_id: self.pluginId,
          attribute_name: attributeName
        }
      );

      if (response === undefined) {
        throw Error('Empty response');
      }

      return response;
    }),

    getSpaceAttributeItem: flow(function* <T>(spaceId: string, attributeName: string, key: string) {
      const response = yield self.getAttributeItemRequest.send(
        api.spaceAttributeRepository.getSpaceAttributeItem,
        {
          spaceId,
          plugin_id: self.pluginId,
          attribute_name: attributeName,
          sub_attribute_key: key
        }
      );

      if (response === undefined || !(key in response)) {
        return null;
      }

      const value: T extends undefined ? never : T = response[key];

      return value;
    }),
    setSpaceAttributeItem: flow(function* <T>(
      spaceId: string,
      attributeName: string,
      key: string,
      value: T
    ) {
      const response = yield self.setAttributeItemRequest.send(
        api.spaceAttributeRepository.setSpaceAttributeItem,
        {
          spaceId,
          plugin_id: self.spaceId,
          attribute_name: attributeName,
          sub_attribute_key: key,
          value
        }
      );

      if (response === undefined) {
        throw Error('Empty response');
      }

      if (!(key in response)) {
        return null;
      }

      const finalValue: T extends undefined ? never : T = response[key];

      return finalValue;
    }),
    deleteSpaceAttributeItem: flow(function* (spaceId: string, attributeName: string, key: string) {
      const response = yield self.deleteAttributeItemRequest.send(
        api.spaceAttributeRepository.deleteSpaceAttribute,
        {
          spaceId,
          plugin_id: self.spaceId,
          attribute_name: attributeName,
          sub_attribute_key: key
        }
      );

      if (response === undefined) {
        throw Error('Empty response');
      }

      if (!(key in response)) {
        return null;
      }

      return response[key];
    })
  }))
  .actions((self) => ({
    getItem: flow(function* <T extends AttributeValueInterface>(spaceId: string, key: string) {
      return yield self.getSpaceAttributeItem<T>(spaceId, AttributeNameEnum.STATE, key);
    }),
    set: flow(function* <T>(spaceId: string, key: string, value: T extends undefined ? never : T) {
      return yield self.setSpaceAttributeItem(spaceId, AttributeNameEnum.STATE, key, value);
    }),
    deleteItem: flow(function* (spaceId: string, key: string) {
      return yield self.deleteSpaceAttributeItem(spaceId, AttributeNameEnum.STATE, key);
    }),
    getConfig: flow(function* <C extends GetSpaceAttributeResponse>() {
      return yield self.getSpaceAttributeValue<C>(appVariables.NODE_ID, AttributeNameEnum.CONFIG);
    })
  }))
  .views((self) => ({
    get stateApi(): PluginStateApiInterface {
      return {
        getItem: async <T>(key: string) => {
          const result = await self.getItem(self.spaceId, key);
          return result as T;
        },
        setItem: async <T>(key: string, value: T extends undefined ? never : T) => {
          return await self.set(self.spaceId, key, value);
        },
        deleteItem: (key: string) => self.deleteItem(self.spaceId, key),
        getConfig: self.getConfig
      };
    },
    get api(): ApiInterface {
      return {
        getSpaceAttributeValue: async <T extends AttributeValueInterface>(
          spaceId: string,
          attributeName: string
        ) => self.getSpaceAttributeValue<T>(spaceId, attributeName) as Promise<T>,
        setSpaceAttributeValue: async <T extends AttributeValueInterface>(
          spaceId: string,
          attributeName: string,
          value: T
        ) => self.setSpaceAttributeValue<T>(spaceId, attributeName, value) as Promise<T>,
        deleteSpaceAttribute: self.deleteSpaceAttribute,
        getSpaceAttributeItem: async <T>(spaceId: string, attributeName: string, key: string) =>
          self.getSpaceAttributeItem<T>(spaceId, attributeName, key) as Promise<T>,
        setSpaceAttributeItem: async <T>(
          spaceId: string,
          attributeName: string,
          key: string,
          value: T
        ) => self.setSpaceAttributeItem<T>(spaceId, attributeName, key, value) as Promise<T>,
        deleteSpaceAttributeItem: async (spaceId: string, attributeName: string, key: string) =>
          self.deleteSpaceAttributeItem(spaceId, attributeName, key),
        subscribeToTopic() {
          // TODO: Implement when PosBus ready
          return Promise.reject('Not yet implemented');
        },
        onAttributeChange() {
          // TODO: Implement when PosBus ready
          return Promise.reject('Not yet implemented');
        },
        onAttributeRemove() {
          // TODO: Implement when PosBus ready
          return Promise.reject('Not yet implemented');
        },
        onAttributeItemChange() {
          // TODO: Implement when PosBus ready
          return Promise.reject('Not yet implemented');
        },
        onAttributeItemRemove() {
          // TODO: Implement when PosBus ready
          return Promise.reject('Not yet implemented');
        }
      };
    }
  }));

export type PluginAttributesManagerType = Instance<typeof PluginAttributesManager>;

export {PluginAttributesManager};
