import {Instance, types} from 'mobx-state-tree';

import {WorldStaker} from 'core/models/WorldStaker';

const World = types.model('World', {
  id: types.string,
  name: types.string,
  description: types.maybe(types.string),
  avatarHash: types.maybeNull(types.string),
  last_staking_comment: types.maybeNull(types.string),
  owner_id: types.string,
  owner_name: types.maybeNull(types.string),
  stake_total: types.maybeNull(types.number),
  stakers: types.maybeNull(types.optional(types.array(WorldStaker), []))
});

export interface WorldModelInterface extends Instance<typeof World> {}

export {World};
