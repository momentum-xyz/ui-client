import {Instance, types} from 'mobx-state-tree';

const PluginQueryResult = types.model('PluginQueryResult', {
  plugin_uuid: types.string,
  plugin_name: types.string
});

export type PluginQueryResultType = Instance<typeof PluginQueryResult>;

export {PluginQueryResult};
