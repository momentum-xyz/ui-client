import {Instance, types} from 'mobx-state-tree';

export const NodeConfig = types.model('NodeConfig', {
  node_id: types.maybe(types.string),
  hostname: types.string,
  name: types.string,
  owner: types.maybe(types.string)
});

export interface NodeConfigInterface extends Instance<typeof NodeConfig> {}

export type NodeConfigInputType = Pick<NodeConfigInterface, 'hostname' | 'name'>;
