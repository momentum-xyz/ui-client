import {Instance, types} from 'mobx-state-tree';

const World = types.model('World', {
  id: types.string,
  name: types.string,
  description: types.maybe(types.string),
  avatarHash: types.maybeNull(types.string)
});

export interface WorldModelInterface extends Instance<typeof World> {}

export {World};
