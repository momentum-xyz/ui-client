import {RequestModel} from '@momentum-xyz/core';
import {PluginApiInterface, AttributeValueInterface, AttributeNameEnum} from '@momentum-xyz/sdk';
import {flow, Instance, types} from 'mobx-state-tree';

import {api, GetObjectAttributeResponse} from 'api';
import {appVariables} from 'api/constants';
import {usePosBusEvent} from 'shared/hooks';

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
      objectId: string,
      attributeName: string
    ) {
      const response = yield self.getAttributeRequest.send(
        api.objectAttributeRepository.getObjectAttribute,
        {
          objectId,
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
      objectId: string,
      attributeName: string,
      value: T
    ) {
      const response = yield self.setAttributeRequest.send(
        api.objectAttributeRepository.setObjectAttribute,
        {
          objectId,
          plugin_id: self.pluginId,
          attribute_name: attributeName,
          value
        }
      );

      if (self.setAttributeRequest.isError) {
        throw Error(response?.error?.message || 'Unknown error');
      }

      return response as T;
    }),
    deleteSpaceAttribute: flow(function* (objectId: string, attributeName: string) {
      const response = yield self.deleteAttributeRequest.send(
        api.objectAttributeRepository.deleteObjectAttribute,
        {
          objectId,
          plugin_id: self.pluginId,
          attribute_name: attributeName
        }
      );

      if (self.deleteAttributeRequest.isError) {
        throw Error(response?.error?.message || 'Unknown error');
      }

      return response;
    }),

    getSpaceAttributeItem: flow(function* <T>(
      objectId: string,
      attributeName: string,
      attributeItemName: string
    ) {
      const response = yield self.getAttributeItemRequest.send(
        api.objectAttributeRepository.getObjectAttributeItem,
        {
          objectId,
          plugin_id: self.pluginId,
          attribute_name: attributeName,
          sub_attribute_key: attributeItemName
        }
      );

      if (response === undefined || !(attributeItemName in response)) {
        return null;
      }

      const value: T extends undefined ? never : T = response[attributeItemName];

      return value;
    }),
    setSpaceAttributeItem: flow(function* <T>(
      objectId: string,
      attributeName: string,
      attributeItemName: string,
      value: T
    ) {
      const response = yield self.setAttributeItemRequest.send(
        api.objectAttributeRepository.setObjectAttributeItem,
        {
          objectId,
          plugin_id: self.pluginId,
          attribute_name: attributeName,
          sub_attribute_key: attributeItemName,
          value
        }
      );

      if (self.setAttributeItemRequest.isError) {
        throw Error(response?.error?.message || 'Unknown error');
      }

      if (!(attributeItemName in response)) {
        return null;
      }

      const finalValue: T extends undefined ? never : T = response[attributeItemName];

      return finalValue;
    }),
    deleteSpaceAttributeItem: flow(function* (
      objectId: string,
      attributeName: string,
      attributeItemName: string
    ) {
      const response = yield self.deleteAttributeItemRequest.send(
        api.objectAttributeRepository.deleteObjectAttribute,
        {
          objectId,
          plugin_id: self.pluginId,
          attribute_name: attributeName,
          sub_attribute_key: attributeItemName
        }
      );

      if (self.deleteAttributeItemRequest.isError) {
        throw Error(response?.error?.message || 'Unknown error');
      }

      if (response === null || !(attributeItemName in response)) {
        return null;
      }

      return response[attributeItemName];
    })
  }))
  .actions((self) => ({
    getItem: flow(function* <T extends AttributeValueInterface>(spaceId: string, key: string) {
      return yield self.getSpaceAttributeItem<T>(spaceId, AttributeNameEnum.STATE, key);
    }),
    set: flow(function* <T>(spaceId: string, key: string, value: T) {
      return yield self.setSpaceAttributeItem(spaceId, AttributeNameEnum.STATE, key, value);
    }),
    deleteItem: flow(function* (spaceId: string, key: string) {
      // TODO: Replace after attribute item is implemented on PosBus
      // return yield self.deleteObjectAttributeItem(spaceId, AttributeNameEnum.STATE, key);
      return yield self.deleteSpaceAttribute(spaceId, AttributeNameEnum.STATE);
    }),
    getConfig: flow(function* <C extends GetObjectAttributeResponse>() {
      return yield self.getSpaceAttributeValue<C>(appVariables.NODE_ID, AttributeNameEnum.CONFIG);
    })
  }))
  .views((self) => ({
    get pluginApi(): PluginApiInterface {
      return {
        getStateItem: async <T>(key: string) => {
          const result = await self.getItem(self.spaceId, key);
          return result as T;
        },
        setStateItem: async <T>(key: string, value: T) => {
          return await self.set(self.spaceId, key, value);
        },
        deleteStateItem: (key: string) => self.deleteItem(self.spaceId, key),
        getConfig: self.getConfig,

        // TODO: Temporary, change to below after PosBus supports attribute items
        // useStateItemChange: <T>(topic: string, key: string, callback: (value: T) => void) => {
        //   return usePosBusEvent(
        //     'space-attribute-item-changed',
        //     (posBusTopic, posBusAttributeName, posBusAttributItemName, value) => {
        //       if (
        //         posBusTopic === topic &&
        //         posBusAttributeName === AttributeNameEnum.STATE &&
        //         posBusAttributItemName === key
        //       ) {
        //         callback(value as T);
        //       }
        //     }
        //   );
        // },

        // TODO: Temporary, change to above after PosBus supports attribute items
        useStateItemChange: <T>(key: string, callback: (value: T) => void) => {
          return usePosBusEvent(
            'space-attribute-changed',
            (posBusTopic, posBusAttributeName, value) => {
              if (
                posBusTopic === self.pluginId &&
                posBusAttributeName === AttributeNameEnum.STATE &&
                value &&
                key in value
              ) {
                callback(value[key] as T);
              }
            }
          );
        },

        // TODO: Temporary, change to below after PosBus supports attribute items
        // useStateItemRemove(topic, key, callback) {
        //   return usePosBusEvent(
        //     'space-attribute-item-removed',
        //     (posBusTopic, posBusAttributeName, posBusAttributItemName) => {
        //       if (
        //         posBusTopic === topic &&
        //         posBusAttributeName === AttributeNameEnum.STATE &&
        //         posBusAttributItemName === key
        //       ) {
        //         callback();
        //       }
        //     }
        //   );
        // },

        // TODO: Temporary, change to above after PosBus supports attribute items
        useStateItemRemove(key, callback) {
          return usePosBusEvent(
            'space-attribute-changed',
            (posBusTopic, posBusAttributeName, value) => {
              if (
                posBusTopic === self.pluginId &&
                posBusAttributeName === AttributeNameEnum.STATE &&
                value === null
              ) {
                callback();
              }
            }
          );
        }
      };
    }
  }));

export type PluginAttributesManagerType = Instance<typeof PluginAttributesManager>;

export {PluginAttributesManager};
