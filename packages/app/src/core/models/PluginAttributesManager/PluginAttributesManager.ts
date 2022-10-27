import {RequestInterface, RequestModel} from '@momentum-xyz/core';
import {flow, Instance, types} from 'mobx-state-tree';

type SubAttributeForPluginType = {
  plugin_id: string;
  attribute_name: string;
  sub_attribute_key: string;
};

type SetSubAttributeForPluginType<Value> = SubAttributeForPluginType & {
  value: Value;
};

const PluginAttributesManager = types
  .model('PluginAttributesManager', {
    pluginId: types.string,

    getStateRequest: types.optional(RequestModel, {}),
    setStateRequest: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    get: flow(function* <
      PluginDataType extends Record<string, unknown>,
      RequestType extends SubAttributeForPluginType & PluginDataType,
      ResponseType
    >(
      getRequestInterface: RequestInterface<RequestType, ResponseType>,
      requestData: PluginDataType,
      key: string
    ) {
      const value = yield self.getStateRequest.send<RequestType, ResponseType>(
        getRequestInterface,
        {
          plugin_id: self.pluginId,
          attribute_name: 'state',
          sub_attribute_key: key,
          ...requestData
        } as RequestType
      );

      return value;
    }),
    set: flow(function* <
      ValueType,
      PluginDataType extends Record<string, unknown>,
      RequestType extends SetSubAttributeForPluginType<ValueType> & PluginDataType,
      ResponseType
    >(
      requestInterface: RequestInterface<RequestType, ResponseType>,
      pluginData: PluginDataType,
      field: string,
      value: ValueType
    ) {
      if (!self.pluginId) {
        return;
      }

      yield self.setStateRequest.send<RequestType, ResponseType>(requestInterface, {
        plugin_id: self.pluginId,
        attribute_name: 'state',
        sub_attribute_key: field,
        value: value,
        ...pluginData
      } as RequestType);
    })
  }));

export type PluginAttributesManagerType = Instance<typeof PluginAttributesManager>;

export {PluginAttributesManager};
