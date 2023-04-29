import {Instance, types} from 'mobx-state-tree';

const BigStakerInfo = types.model('BigStakerInfo', {
  user_id: types.string,
  name: types.string,
  avatarHash: types.maybeNull(types.string),
  stake_count: 0
});

export interface BigStakerInfoModelInterface extends Instance<typeof BigStakerInfo> {}

export {BigStakerInfo};
