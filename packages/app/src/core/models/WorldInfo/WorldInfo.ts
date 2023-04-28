import {Instance, types} from 'mobx-state-tree';

const WorldInfo = types.model('WorldInfo', {
  id: types.identifier,
  name: types.string,
  description: types.maybe(types.string),
  avatarHash: types.maybeNull(types.string),
  owner_id: types.string,
  owner_name: types.maybeNull(types.string),
  stake_total: types.maybe(types.string)
});

export interface WorldInfoModelInterface extends Instance<typeof WorldInfo> {}

export {WorldInfo};
