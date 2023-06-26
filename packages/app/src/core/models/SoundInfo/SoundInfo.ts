import {types, Instance} from 'mobx-state-tree';

const SoundInfo = types.model('SoundInfo', {
  name: types.string,
  render_hash: types.string
});

export interface SoundInfoModelInterface extends Instance<typeof SoundInfo> {}

export {SoundInfo};
