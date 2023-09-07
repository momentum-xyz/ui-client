import {flow, types} from 'mobx-state-tree';
import {RequestModel} from '@momentum-xyz/core';
import {AttributeNameEnum, AttributeValueInterface} from '@momentum-xyz/sdk';

import {api} from 'api';
import {PluginIdEnum} from 'api/enums';

export const ObjectUserAttribute = types
  .model('ObjectUserAttribute', {
    objectId: types.string,
    userId: types.string,
    attributeName: types.optional(types.string, AttributeNameEnum.STATE),
    pluginId: types.optional(types.string, PluginIdEnum.CORE),
    _value: types.maybe(types.frozen<AttributeValueInterface>()),
    request: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    load: flow(function* () {
      const params = {
        spaceId: self.objectId,
        userId: self.userId,
        pluginId: self.pluginId,
        attributeName: self.attributeName
      };
      console.log('[ObjectUserAttribute] load', params);
      const response: AttributeValueInterface | undefined = yield self.request.send(
        api.spaceUserAttributeRepository.getSpaceUserAttribute,
        {
          spaceId: self.objectId,
          userId: self.userId,
          pluginId: self.pluginId,
          attributeName: self.attributeName
        }
      );

      console.log('[ObjectUserAttribute] load', params, 'resp:', response);

      if (response) {
        self._value = response;
      }

      return response;
    }),
    set: flow(function* (value: AttributeValueInterface) {
      console.log('[ObjectUserAttribute] set:', value);

      const data = {
        spaceId: self.objectId,
        userId: self.userId,
        pluginId: self.pluginId,
        attributeName: self.attributeName,
        value
      };

      yield self.request.send(api.spaceUserAttributeRepository.setSpaceUserAttribute, data);

      if (self.request.isError) {
        throw new Error('Error setting attribute: ' + self.request.errorCode);
      }

      self._value = value;
    }),
    setItem: flow(function* (itemName: string, value: unknown) {
      console.log('[ObjectUserAttribute] setItem:', itemName, value);
      const data = {
        spaceId: self.objectId,
        userId: self.userId,
        pluginId: self.pluginId,
        attributeName: self.attributeName,
        sub_attribute_key: itemName,
        sub_attribute_value: value
      };
      yield self.request.send(api.spaceUserAttributeRepository.setSpaceUserSubAttribute, data);

      if (self.request.isError) {
        throw new Error('Error setting attribute item: ' + self.request.errorCode);
      }

      if (self._value) {
        self._value[itemName] = value;
      } else {
        self._value = {[itemName]: value};
      }
    }),
    delete: flow(function* () {
      const params = {
        spaceId: self.objectId,
        userId: self.userId,
        pluginId: self.pluginId,
        attributeName: self.attributeName
      };
      console.log('[ObjectUserAttribute] delete', params);
      yield self.request.send(api.spaceUserAttributeRepository.deleteSpaceUserAttribute, params);

      if (self.request.isError) {
        throw new Error('Error deleting attribute: ' + self.request.errorCode);
      }
    }),
    countAllUsers: flow(function* () {
      const params = {
        spaceId: self.objectId,
        pluginId: self.pluginId,
        attributeName: self.attributeName
      };
      console.log('[ObjectUserAttribute] countAllUsers', params);
      const response: number = yield self.request.send(
        api.spaceUserAttributeRepository.getSpaceUserAttributeCount,
        params
      );

      console.log('[ObjectUserAttribute] countAllUsers', params, 'resp:', response);

      return response;
    })
  }))
  .views((self) => ({
    get value(): AttributeValueInterface | undefined {
      return self._value;
    },
    get isPending(): boolean {
      return self.request.isPending;
    }
  }));
