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
    requestInterface: types.maybe(types.frozen<RequestInterface<unknown, unknown>>()),

    getStateRequest: types.optional(RequestModel, {}),
    setStateRequest: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    init: flow(function* <
      PluginDataType extends Record<string, unknown>,
      RequestType extends SubAttributeForPluginType,
      ResponseType
    >(
      requestInterface: RequestInterface<RequestType, ResponseType>,
      requestData: PluginDataType,
      pluginId: string,
      fields: string[]
    ) {
      self.pluginId = pluginId;
      self.fields = cast(fields);
      self.requestInterface = requestInterface as RequestInterface<unknown, unknown>;
      self.requestData = requestData;

      const state: PluginStateInterface = {};

      for (const field of fields) {
        const attributeValue = yield self.getStateRequest.send<RequestType, ResponseType>(
          requestInterface,
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
      self.fields = cast([]);
      self.requestInterface = undefined;
      self.requestData = undefined;
    },
    setPluginState: flow(function* <
      ValueType,
      PluginDataType extends Record<string, unknown>,
      RequestType extends SetSubAttributeForPluginType<ValueType> & PluginDataType,
      ResponseType
    >(
      request: RequestInterface<RequestType, ResponseType>,
      pluginData: PluginDataType,
      field: string,
      value: ValueType
    ) {
      if (!self.pluginId) {
        return;
      }

      yield self.setStateRequest.send<RequestType, ResponseType>(request, {
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
      if (!self.fields || !self.pluginId || !self.requestInterface || !self.requestData) {
        return;
      }

      yield self.init(self.requestInterface, self.requestData, self.pluginId, self.fields);
    })
  }))
  .views((self) => ({
    get isInitiated(): boolean {
      return !!self.pluginId;
    }
  }));

export type PluginStateType = Instance<typeof PluginState>;

export {PluginState};
