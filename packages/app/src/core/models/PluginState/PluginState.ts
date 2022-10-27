import {RequestInterface, RequestModel} from '@momentum-xyz/core';
import {PluginStateInterface} from '@momentum-xyz/sdk';
import {cast, flow, Instance, types} from 'mobx-state-tree';

type SubAttributeForPluginType = {
  plugin_id: string;
  attribute_name: string;
  sub_attribute_key: string;
};

type SetSubAttributeForPluginType<Value> = SubAttributeForPluginType & {
  value: Value;
};

const PluginState = types
  .model('PluginState', {
    pluginId: types.maybe(types.string),
    requestData: types.maybe(types.frozen<Record<string, unknown>>()),
    data: types.optional(types.frozen<PluginStateInterface>(), {}),
    fields: types.optional(types.array(types.string), []),
    getRequestInterface: types.maybe(types.frozen<RequestInterface<unknown, unknown>>()),

    getStateRequest: types.optional(RequestModel, {}),
    setStateRequest: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    init: flow(function* <
      PluginDataType extends Record<string, unknown>,
      RequestType extends SubAttributeForPluginType,
      ResponseType
    >(
      getRequestInterface: RequestInterface<RequestType, ResponseType>,
      requestData: PluginDataType,
      pluginId: string,
      fields: string[]
    ) {
      self.pluginId = pluginId;
      self.requestData = requestData;
      self.fields = cast(fields);
      self.getRequestInterface = getRequestInterface as RequestInterface<unknown, unknown>;

      const state: PluginStateInterface = {};

      for (const field of fields) {
        const attributeValue = yield self.getStateRequest.send<RequestType, ResponseType>(
          getRequestInterface,
          {
            ...self.requestData,
            plugin_id: self.pluginId,
            attribute_name: 'state',
            sub_attribute_key: field
          } as RequestType
        );

        state[field] = attributeValue;
      }

      self.data = state;
    }),
    deinit() {
      self.pluginId = undefined;
      self.requestData = undefined;
      self.data = {};
      self.fields = cast([]);
      self.getRequestInterface = undefined;
    },
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
  }))
  .actions((self) => ({
    reload: flow(function* () {
      if (!self.fields || !self.pluginId || !self.getRequestInterface || !self.requestData) {
        return;
      }

      yield self.init(self.getRequestInterface, self.requestData, self.pluginId, self.fields);
    })
  }))
  .views((self) => ({
    get isInitiated(): boolean {
      return !!self.pluginId;
    }
  }));

export type PluginStateType = Instance<typeof PluginState>;

export {PluginState};
