import {Instance, types} from 'mobx-state-tree';

import {PermanentType, TileType} from 'core/enums';
import {ContentInterface, UUIDModel} from 'core/models';

const Tile = types
  .model('Tile', {
    id: types.maybe(types.string),
    hash: types.string,
    permanentType: types.maybeNull(types.enumeration(Object.values(PermanentType))),
    column: types.number,
    row: types.number,
    type: types.enumeration(Object.values(TileType)),
    content: types.maybe(types.frozen<ContentInterface>()),
    edited: types.maybe(types.number),
    internal: types.maybe(types.boolean),
    render: types.maybe(types.number),
    updatedAt: types.maybeNull(types.string),
    uiTypeId: UUIDModel,
    spaceId: UUIDModel
  })
  .views((self) => ({}));

export interface TileInterface extends Instance<typeof Tile> {}

export {Tile};
