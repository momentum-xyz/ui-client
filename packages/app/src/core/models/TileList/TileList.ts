import {cast, Instance, types} from 'mobx-state-tree';
import {cloneDeep} from 'lodash-es';

import {COLUMNS} from 'core/constants';
import {TileInterface} from 'core/models';

const TileList = types
  .model('TileList', {
    owner_id: types.maybe(types.string),
    tiles: types.optional(types.array(types.frozen<TileInterface>()), []),
    status: types.maybe(types.number),
    message: types.maybe(types.string)
  })
  .actions((self) => ({
    updateTiles(tiles: TileInterface[]) {
      self.tiles = cast(cloneDeep(tiles));
    }
  }))
  .views((self) => ({
    get tileMatrix(): TileInterface[][] {
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
