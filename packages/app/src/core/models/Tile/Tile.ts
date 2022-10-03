import {Instance, types} from 'mobx-state-tree';
import {UUIDModel} from '@momentum/core';

import {PermanentTypeEnum, TileTypeEnum} from 'core/enums';
import {ContentInterface} from 'core/models';

const Tile = types.model('Tile', {
  id: types.maybe(types.string),
  hash: types.string,
  permanentType: types.maybeNull(types.enumeration(Object.values(PermanentTypeEnum))),
  column: types.number,
  row: types.number,
  type: types.enumeration(Object.values(TileTypeEnum)),
  content: types.maybe(types.frozen<ContentInterface>()),
  edited: types.maybe(types.number),
  internal: types.maybe(types.boolean),
  render: types.maybe(types.number),
  updatedAt: types.maybeNull(types.string),
  uiTypeId: UUIDModel,
  spaceId: UUIDModel
});

export interface TileInterface extends Instance<typeof Tile> {}

export {Tile};
