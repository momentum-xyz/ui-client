import {types, Instance} from 'mobx-state-tree';

const SoundInfo = types.model('SoundInfo', {
  name: types.string,
  hash: types.string
});

export interface SoundInfoModelInterface extends Instance<typeof SoundInfo> {}

export {SoundInfo};
