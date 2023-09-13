import {RequestModel} from '@momentum-xyz/core';
import {
  PluginApiInterface,
  AttributeValueInterface,
  ApiInterface,
  AttributeNameEnum
} from '@momentum-xyz/sdk';
import {flow, Instance, types} from 'mobx-state-tree';

import {api, GetObjectAttributeResponse} from 'api';
import {appVariables} from 'api/constants';
import {PosBusService} from 'shared/services';
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
      spaceId: string,
      attributeName: string
    ) {
      const response = yield self.getAttributeRequest.send(
        api.objectAttributeRepository.getObjectAttribute,
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
        api.objectAttributeRepository.setSpaceAttribute,
        {
          spaceId,
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
    deleteSpaceAttribute: flow(function* (spaceId: string, attributeName: string) {
      const response = yield self.deleteAttributeRequest.send(
        api.objectAttributeRepository.deleteSpaceAttribute,
        {
          spaceId,
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
      spaceId: string,
      attributeName: string,
      attributeItemName: string
    ) {
      const response = yield self.getAttributeItemRequest.send(
        api.objectAttributeRepository.getSpaceAttributeItem,
        {
          spaceId,
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
      spaceId: string,
      attributeName: string,
      attributeItemName: string,
      value: T
    ) {
      const response = yield self.setAttributeItemRequest.send(
        api.objectAttributeRepository.setSpaceAttributeItem,
        {
          spaceId,
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
      spaceId: string,
      attributeName: string,
      attributeItemName: string
    ) {
      const response = yield self.deleteAttributeItemRequest.send(
        api.objectAttributeRepository.deleteSpaceAttribute,
        {
          spaceId,
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
      // return yield self.deleteSpaceAttributeItem(spaceId, AttributeNameEnum.STATE, key);
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

        getSpaceAttributeItem: async <T>(
          spaceId: string,
          attributeName: string,
          attributeItemName: string
        ) => self.getSpaceAttributeItem<T>(spaceId, attributeName, attributeItemName) as Promise<T>,
        setSpaceAttributeItem: async <T>(
          spaceId: string,
          attributeName: string,
          attributeItemName: string,
          value: T
        ) =>
          self.setSpaceAttributeItem<T>(
            spaceId,
            attributeName,
            attributeItemName,
            value
          ) as Promise<T>,
        // TODO: Change bellow to this after PosBus supports attribute items
        // deleteSpaceAttributeItem: async (
        //   spaceId: string,
        //   attributeName: string,
        //   attributeItemName: string
        // ) => self.deleteSpaceAttributeItem(spaceId, attributeName, attributeItemName),

        // TODO: Change above to this after PosBus supports attribute items
        deleteSpaceAttributeItem: async (
          spaceId: string,
          attributeName: string,
          attributeItemName: string
        ) => self.deleteSpaceAttribute(spaceId, attributeName),
        subscribeToTopic: (topic) => {
          PosBusService.subscribe(topic);
        },
        unsubscribeFromTopic: (topic) => {
          PosBusService.unsubscribe(topic);
        },

        useAttributeChange: <T extends AttributeValueInterface>(
          topic: string,
          attributeName: string,
          callback: (value: T) => void
        ) => {
          return usePosBusEvent(
            'space-attribute-changed',
            (posBusTopic, posBusAttributeName, value) => {
              if (posBusTopic === topic && posBusAttributeName === attributeName) {
                callback(value as unknown as T);
              }
            }
          );
        },
        useAttributeRemove(topic, attributeName, callback) {
          return usePosBusEvent('space-attribute-removed', (posBusTopic, posBusAttributeName) => {
            if (posBusTopic === topic && posBusAttributeName === attributeName) {
              callback();
            }
          });
        },
        useAttributeItemChange: <T>(
          topic: string,
          attributeName: string,
          attributeItemName: string,
          callback: (value: T) => void
        ) => {
          return usePosBusEvent(
            'space-attribute-item-changed',
            (posBusTopic, posBusAttributeName, posBusAttributItemName, value) => {
              if (
                posBusTopic === topic &&
                posBusAttributeName === attributeName &&
                posBusAttributItemName === attributeItemName
              ) {
                callback(value as T);
              }
            }
          );
        },
        useAttributeItemRemove(topic, attributeName, attributeItemName, callback) {
          return usePosBusEvent(
            'space-attribute-item-removed',
            (posBusTopic, posBusAttributeName, posBusAttributItemName) => {
              if (
                posBusTopic === topic &&
                posBusAttributeName === attributeName &&
                posBusAttributItemName === attributeItemName
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
