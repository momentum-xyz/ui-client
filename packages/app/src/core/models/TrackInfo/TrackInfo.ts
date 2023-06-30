import {types, Instance} from 'mobx-state-tree';

const TrackInfo = types.model('TrackInfo', {
  name: types.string,
  render_hash: types.string
});

export interface TrackInfoModelInterface extends Instance<typeof TrackInfo> {}

export {TrackInfo};
