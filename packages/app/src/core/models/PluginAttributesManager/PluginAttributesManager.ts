import {ObjectTypeIdEnum, RequestModel} from '@momentum-xyz/core';
import {
  PluginApiInterface,
  AttributeValueInterface,
  AttributeNameEnum,
  SetWorld,
  Transform,
  PluginApiEventHandlersType
} from '@momentum-xyz/sdk';
import {flow, Instance, types} from 'mobx-state-tree';

import {api, GetObjectAttributeResponse} from 'api';
import {appVariables} from 'api/constants';
import {usePosBusEvent} from 'shared/hooks';
import {PosBusService} from 'shared/services';
import {PosBusEventEmitter} from 'core/constants';
import {Asset3dCategoryEnum} from 'api/enums';

import {ObjectAttribute} from '../ObjectAttribute';

const PluginAttributesManager = types
  .model('PluginAttributesManager', {
    pluginId: types.string,
    worldId: types.maybeNull(types.string),

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
    setWorldId(worldInfo: SetWorld | null) {
      self.worldId = worldInfo?.id || null;
    }
  }))
  .actions((self) => ({
    afterCreate() {
      console.log('PluginAttributesManager afterCreate');
      PosBusEventEmitter.on('set-world', self.setWorldId);
    },
    beforeDestroy() {
      console.log('PluginAttributesManager beforeDestroy');
      PosBusEventEmitter.off('set-world', self.setWorldId);
    }
  }))
  .actions((self) => ({
    getItem: flow(function* <T extends AttributeValueInterface>(objectId: string, key: string) {
      return yield self.getSpaceAttributeItem<T>(objectId, AttributeNameEnum.STATE, key);
    }),
    set: flow(function* <T>(objectId: string, key: string, value: T) {
      return yield self.setSpaceAttributeItem(objectId, AttributeNameEnum.STATE, key, value);
    }),
    deleteItem: flow(function* (objectId: string, key: string) {
      // TODO: Replace after attribute item is implemented on PosBus
      // return yield self.deleteObjectAttributeItem(spaceId, AttributeNameEnum.STATE, key);
      return yield self.deleteSpaceAttribute(objectId, AttributeNameEnum.STATE);
    }),
    getConfig: flow(function* <C extends GetObjectAttributeResponse>() {
      return yield self.getSpaceAttributeValue<C>(appVariables.NODE_ID, AttributeNameEnum.CONFIG);
    })
  }))
  .views((self) => ({
    get pluginApi(): PluginApiInterface {
      return {
        getStateItem: async <T>(key: string) => {
          if (self.worldId === null) {
            throw new Error('worldId is not set');
          }
          const result = await self.getItem(self.worldId, key);
          return result as T;
        },
        setStateItem: async <T>(key: string, value: T) => {
          if (self.worldId === null) {
            throw new Error('worldId is not set');
          }
          return await self.set(self.worldId, key, value);
        },
        deleteStateItem: (key: string) => {
          if (self.worldId === null) {
            throw new Error('worldId is not set');
          }
          return self.deleteItem(self.worldId, key);
        },
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
        },

        on(handlers: Partial<PluginApiEventHandlersType>) {
          const unsubscribeCallbacks = Object.entries(handlers).map(([eventName, handler]) => {
            if (handler) {
              PosBusEventEmitter.on(eventName as keyof PluginApiEventHandlersType, handler);
              return () =>
                PosBusEventEmitter.off(eventName as keyof PluginApiEventHandlersType, handler);
            }
            return () => {};
          });

          setTimeout(() => {
            if (!PosBusService.worldInfo) {
              return;
            }
            handlers['set-world']?.(PosBusService.worldInfo);

            if (PosBusService.myTransform) {
              handlers['my-transform']?.(PosBusService.myTransform);
            }

            for (const [, objectDefinition] of PosBusService.objectDefinitions) {
              handlers['add-object']?.(objectDefinition);
            }

            for (const [, objectData] of PosBusService.objectDatas) {
              handlers['object-data']?.(objectData.id, objectData);
            }

            for (const [id, objectTransform] of PosBusService.objectTransforms) {
              handlers['object-transform']?.(id, objectTransform);
            }

            if (PosBusService.users.size > 0) {
              handlers['users-added']?.(Array.from(PosBusService.users.values()));
            }

            if (PosBusService.usersTransforms.size > 0) {
              handlers['users-transform-list']?.(
                Array.from(PosBusService.usersTransforms.values())
              );
            }
          }, 0);

          return () => {
            unsubscribeCallbacks.forEach((unsubscribeCallback) => unsubscribeCallback());
          };
        },

        requestObjectLock: (objectId: string) => {
          console.log('requestObjectLock', objectId);
          return PosBusService.requestObjectLock(objectId);
        },

        requestObjectUnlock: (objectId: string) => {
          console.log('requestObjectUnlock', objectId);
          return PosBusService.requestObjectUnlock(objectId);
        },

        spawnObject: async ({
          name,
          asset_2d_id = null,
          asset_3d_id = null,
          transform,
          object_type_id = ObjectTypeIdEnum.NORMAL
        }: {
          name: string;
          asset_2d_id?: string | null;
          asset_3d_id: string | null;
          object_type_id?: string;
          transform?: Transform;
        }) => {
          if (!self.worldId) {
            throw new Error('worldId is not set');
          }
          const response = await api.objectRepository.createObject({
            parent_id: self.worldId,
            object_name: name,
            asset_2d_id: asset_2d_id || undefined,
            asset_3d_id: asset_3d_id || undefined,
            object_type_id,
            transform
          });

          console.log('spawnObject', response);
          if (response.status >= 300) {
            throw Error(response.statusText);
          }
          const {object_id} = response.data;
          return {id: object_id};
        },

        transformObject: (objectId: string, objectTransform: Transform) => {
          PosBusService.sendObjectTransform(objectId, objectTransform);
        },

        getObjectInfo: async (objectId: string) => {
          const response = await api.objectInfoRepository.getObjectInfo({objectId});
          console.log('getObjectInfo', response);
          if (response.status >= 300) {
            throw Error(response.statusText);
          }
          return response.data;
        },

        removeObject: async (objectId: string) => {
          const response = await api.objectRepository.deleteObject({
            objectId
          });

          console.log('removeObject', response);
          if (response.status >= 300) {
            throw Error(response.statusText);
          }

          return response.data;
        },

        getSupportedAssets3d: async (category: 'basic' | 'custom') => {
          const response = await api.assets3dRepository.fetchAssets3d(
            {
              category: category as Asset3dCategoryEnum
            },
            undefined as any
          );
          console.log('getSupportedAssets3d', response);
          if (response.status >= 300) {
            throw Error(response.statusText);
          }
          return response.data;
        },

        setObjectAttribute: ({
          name,
          value,
          objectId
        }: {
          name: string;
          value: any;
          objectId: string;
          // pluginId?: string
        }) => {
          const model = ObjectAttribute.create({
            objectId,
            attributeName: name
          });
          return model.set(value);
        },

        removeObjectAttribute: ({
          name,
          objectId
        }: // pluginId
        {
          name: string;
          objectId: string;
          pluginId?: string;
        }) => {
          const model = ObjectAttribute.create({
            objectId,
            attributeName: name
          });
          return model.delete();
        },

        getObjectAttribute: ({
          name,
          objectId
        }: // pluginId
        {
          name: string;
          objectId: string;
          pluginId?: string;
        }) => {
          const model = ObjectAttribute.create({
            objectId,
            attributeName: name
          });
          return model.load();
        },

        setObjectColor: (objectId: string, color: string | null) => {
          const model = ObjectAttribute.create({
            objectId,
            attributeName: 'object_color'
          });
          return model.set({value: color});
        },

        setObjectName: (objectId: string, name: string) => {
          const model = ObjectAttribute.create({
            objectId,
            attributeName: 'name'
          });
          return model.set({value: name});
        },

        async uploadImage(data: {file: File}): Promise<{hash: string}> {
          const response = await api.mediaRepository.uploadImage(data);
          console.log('uploadImage result', response);
          if (response.status >= 300) {
            throw Error(response.statusText);
          }
          return response.data;
        },

        async uploadAsset3d(data: {
          name: string;
          asset: File;
          isPrivate?: boolean;
          previewHash?: string;
          onUploadProgress?: (progressEvent: any) => void;
        }): Promise<{id: string}> {
          const response = await api.assets3dRepository.upload3DAsset(data);
          console.log('uploadAsset3d result', response);
          if (response.status >= 300) {
            throw Error(response.statusText);
          }
          return response.data;
        }
      };
    }
  }));

export type PluginAttributesManagerType = Instance<typeof PluginAttributesManager>;

export {PluginAttributesManager};
