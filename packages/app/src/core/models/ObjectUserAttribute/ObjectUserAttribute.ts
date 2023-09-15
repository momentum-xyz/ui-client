import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel} from '@momentum-xyz/core';
import {AttributeNameEnum, AttributeValueInterface} from '@momentum-xyz/sdk';

import {GetAllObjectUserAttributeListResponse, api} from 'api';
import {PluginIdEnum} from 'api/enums';

export const ObjectUserAttribute = types
  .model('ObjectUserAttribute', {
    objectId: types.string,
    userId: types.string,
    attributeName: types.optional(types.string, AttributeNameEnum.STATE),
    pluginId: types.optional(types.string, PluginIdEnum.CORE),
    _value: types.maybe(types.maybeNull(types.frozen<AttributeValueInterface>())),
    items: types.maybeNull(types.array(types.frozen())),
    count: types.maybe(types.number),
    request: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    load: flow(function* () {
      const params = {
        objectId: self.objectId,
        userId: self.userId,
        pluginId: self.pluginId,
        attributeName: self.attributeName
      };
      console.log('[ObjectUserAttribute] load', params);
      const response: AttributeValueInterface | undefined = yield self.request.send(
        api.objectUserAttributeRepository.getObjectUserAttribute,
        {
          objectId: self.objectId,
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
        objectId: self.objectId,
        userId: self.userId,
        pluginId: self.pluginId,
        attributeName: self.attributeName,
        value
      };

      yield self.request.send(api.objectUserAttributeRepository.setObjectUserAttribute, data);

      if (self.request.isError) {
        throw new Error('Error setting attribute: ' + self.request.errorCode);
      }

      self._value = value;
    }),
    setItem: flow(function* (itemName: string, value: unknown) {
      console.log('[ObjectUserAttribute] setItem:', itemName, value);
      const data = {
        objectId: self.objectId,
        userId: self.userId,
        pluginId: self.pluginId,
        attributeName: self.attributeName,
        sub_attribute_key: itemName,
        sub_attribute_value: value
      };
      yield self.request.send(api.objectUserAttributeRepository.setObjectUserSubAttribute, data);

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
        objectId: self.objectId,
        userId: self.userId,
        pluginId: self.pluginId,
        attributeName: self.attributeName
      };
      console.log('[ObjectUserAttribute] delete', params);
      yield self.request.send(api.objectUserAttributeRepository.deleteObjectUserAttribute, params);

      if (self.request.isError) {
        throw new Error('Error deleting attribute: ' + self.request.errorCode);
      }

      self._value = null;
    }),
    deleteItem: flow(function* (itemName: string) {
      const params = {
        objectId: self.objectId,
        userId: self.userId,
        pluginId: self.pluginId,
        attributeName: self.attributeName,
        sub_attribute_key: itemName
      };
      console.log('[ObjectUserAttribute] deleteItem', params);
      yield self.request.send(
        api.objectUserAttributeRepository.deleteObjectUserSubAttribute,
        params
      );

      if (self.request.isError) {
        throw new Error('Error deleting attribute item: ' + self.request.errorCode);
      }
    }),
    countAllUsers: flow(function* () {
      const params = {
        objectId: self.objectId,
        pluginId: self.pluginId,
        attributeName: self.attributeName
      };
      console.log('[ObjectUserAttribute] countAllUsers', params);
      const response: {count: number} = yield self.request.send(
        api.objectUserAttributeRepository.getObjectUserAttributeCount,
        params
      );

      console.log('[ObjectUserAttribute] countAllUsers', params, 'resp:', response);

      self.count = response?.count || 0;

      return response;
    }),
    entries: flow(function* ({
      fields,
      offset = 0,
      limit = Number.MAX_SAFE_INTEGER,
      order,
      orderDirection = 'DESC',
      filterField,
      filterValue,
      q
    }: {
      fields?: string[];
      offset?: number;
      limit?: number;
      order?: string;
      orderDirection?: 'ASC' | 'DESC';
      filterField?: string;
      filterValue?: string;
      q?: string;
    }) {
      const response: GetAllObjectUserAttributeListResponse = yield self.request.send(
        api.objectUserAttributeRepository.getAllObjectUserAttributeList,
        {
          objectId: self.objectId,
          pluginId: self.pluginId,
          attributeName: self.attributeName,
          fields,
          offset,
          limit,
          order,
          orderDirection,
          filterField,
          filterValue,
          q
        }
      );

      if (response) {
        const {items, count} = response;
        self.count = count;
        self.items = cast(offset === 0 ? items : [...(self.items || []), items]);
      }

      return response;
    })
  }))
  .views((self) => ({
    get value(): AttributeValueInterface | null | undefined {
      return self._value;
    },
    get isPending(): boolean {
      return self.request.isPending;
    }
  }));
