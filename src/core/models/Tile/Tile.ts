import {Instance, types} from 'mobx-state-tree';

import {PermanentType, TileType} from 'core/enums';

import {Content} from '../Content';

const Tile = types
  .model('Tile', {
    id: types.string,
    owner_id: types.string,
    hash: types.string,
    permanentType: types.maybeNull(types.enumeration(Object.values(PermanentType))),
    column: types.number,
    row: types.number,
    type: types.maybe(types.enumeration(Object.values(TileType))),
    content: types.optional(Content, {text: '', title: '', type: '', url: ''}),
    edited: types.number
  })
  .views((self) => ({}));

export interface TileInterface extends Instance<typeof Tile> {}

export {Tile};
