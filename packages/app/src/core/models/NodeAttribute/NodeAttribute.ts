import {flow, types} from 'mobx-state-tree';
import {RequestModel} from '@momentum-xyz/core';
import {AttributeValueInterface} from '@momentum-xyz/sdk';

import {api} from 'api';
import {PluginIdEnum} from 'api/enums';

export const NodeAttribute = types
  .model('NodeAttribute', {
    attributeName: types.string,
    pluginId: types.optional(types.string, PluginIdEnum.CORE),
    _value: types.maybe(types.frozen<AttributeValueInterface>()),
    request: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    load: flow(function* () {
      const data = {
        pluginId: self.pluginId,
        attributeName: self.attributeName
      };
      console.log('NodeAttribute load', data);
      const response: AttributeValueInterface | undefined = yield self.request.send(
        api.nodeAttributeRepository.getNodeAttribute,
        data
      );

      console.log('NodeAttribute load', data, 'resp:', response);

      if (response) {
        self._value = response;
      }

      return response;
    }),
    set: flow(function* (value: AttributeValueInterface) {
      const data = {
        pluginId: self.pluginId,
        attributeName: self.attributeName,
        attributeValue: value
      };
      console.log('NodeAttribute set:', data);

      yield self.request.send(api.nodeAttributeRepository.setNodeAttribute, data);

      if (self.request.isError) {
        throw new Error('Error setting attribute: ' + self.request.errorCode);
      }

      self._value = value;
    }),
    delete: flow(function* () {
      const data = {
        pluginId: self.pluginId,
        attributeName: self.attributeName
      };
      console.log('NodeAttribute delete:', data);
      yield self.request.send(api.nodeAttributeRepository.deleteNodeAttribute, data);

      if (self.request.isError) {
        throw new Error('Error deleting attribute: ' + self.request.errorCode);
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
