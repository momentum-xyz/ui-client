import {Instance, types} from 'mobx-state-tree';

const TrackModel = types.model('TrackModel', {
  trackHash: types.string,
  name: types.string
});

export interface TrackModelInterface extends Instance<typeof TrackModel> {}

export {TrackModel};
