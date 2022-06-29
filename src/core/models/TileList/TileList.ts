import {Instance, types} from 'mobx-state-tree';

import {COLUMNS} from 'core/constants';

import {Tile, TileInterface} from '../Tile';

const TileList = types
  .model('TileList', {
    owner_id: types.maybe(types.string),
    tiles: types.optional(types.array(Tile), [])
  })
  .views((self) => ({
    get tileMatrix() {
      console.info('HERE?', self.tiles);
      const tiles = [...self.tiles];
      return tiles
        .sort((a, b) => a.row - b.row)
        .reduce((carry, item) => {
          if (carry[item.column]) {
            carry[item.column].push(item);
          } else {
            carry[0].push(item);
          }

          return carry;
        }, Array.from({length: COLUMNS.length}, () => []) as TileInterface[][]);
    }
  }));

export interface TileListInterface extends Instance<typeof TileList> {}

export {TileList};
