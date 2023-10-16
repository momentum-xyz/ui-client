import {flow, types} from 'mobx-state-tree';
import {RequestModel} from '@momentum-xyz/core';
import {AttributeNameEnum, AttributeValueInterface} from '@momentum-xyz/sdk';

import {api} from 'api';
import {PluginIdEnum} from 'api/enums';

export const ObjectAttribute = types
  .model('ObjectAttribute', {
    objectId: types.string,
    attributeName: types.optional(types.string, AttributeNameEnum.STATE),
    pluginId: types.optional(types.string, PluginIdEnum.CORE),
    _value: types.maybe(types.frozen<AttributeValueInterface>()),
    request: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    load: flow(function* () {
      console.log('ObjectAttribute load', {
        spaceId: self.objectId,
        plugin_id: self.pluginId,
        attribute_name: self.attributeName
      });
      const response: AttributeValueInterface | undefined = yield self.request.send(
        api.objectAttributeRepository.getObjectAttribute,
        {
          objectId: self.objectId,
          plugin_id: self.pluginId,
          attribute_name: self.attributeName
        }
      );

      console.log(
        'ObjectAttribute load',
        {
          spaceId: self.objectId,
          plugin_id: self.pluginId,
          attribute_name: self.attributeName
        },
        'resp:',
        response
      );

      if (self.request.isError) {
        throw new Error(
          'Error loading attribute: ' +
            ((response?.error as any)?.message || self.request.errorCode)
        );
      }

      if (response) {
        self._value = response;
      }

      return response;
    }),
    set: flow(function* (value: AttributeValueInterface) {
      console.log('ObjectAttribute set:', value);

      const response = yield self.request.send(api.objectAttributeRepository.setObjectAttribute, {
        objectId: self.objectId,
        plugin_id: self.pluginId,
        attribute_name: self.attributeName,
        value
      });

      if (self.request.isError) {
        throw new Error(
          'Error setting attribute: ' + (response?.error?.message || self.request.errorCode)
        );
      }

      self._value = value;
    }),
    setItem: flow(function* (itemName: string, value: unknown) {
      const response = yield self.request.send(
        api.objectAttributeRepository.setObjectAttributeItem,
        {
          objectId: self.objectId,
          plugin_id: self.pluginId,
          attribute_name: self.attributeName,
          sub_attribute_key: itemName,
          value
        }
      );

      if (self.request.isError) {
        throw new Error(
          'Error setting attribute item: ' + (response?.error?.message || self.request.errorCode)
        );
      }

      if (self._value) {
        self._value[itemName] = value;
      } else {
        self._value = {[itemName]: value};
      }
    }),
    delete: flow(function* () {
      const response = yield self.request.send(
        api.objectAttributeRepository.deleteObjectAttribute,
        {
          objectId: self.objectId,
          plugin_id: self.pluginId,
          attribute_name: self.attributeName
        }
      );

      if (self.request.isError) {
        throw new Error(
          'Error deleting attribute: ' + (response?.error?.message || self.request.errorCode)
        );
      }
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
