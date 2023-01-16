import {Instance, types} from 'mobx-state-tree';

import {NftItem} from 'core/models';

const NftItemStats = types.compose(
  NftItem,
  types.model('NftItemStats', {
    connections: 0,
    docking: 0,
    events: 0
  })
);

export interface NftItemStatsModelInterface extends Instance<typeof NftItemStats> {}
