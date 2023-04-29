import {Instance, types} from 'mobx-state-tree';

const WorldStaker = types.model('WorldStaker', {
  user_id: types.string,
  name: types.string,
  stake: types.string,
  avatarHash: types.maybeNull(types.string)
});

export interface WorldStakerModelInterface extends Instance<typeof WorldStaker> {}

export {WorldStaker};
