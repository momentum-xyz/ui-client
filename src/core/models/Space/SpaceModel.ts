import {Instance, types} from 'mobx-state-tree';

import {UUIDModel} from 'core/models/UUID';
import {SpaceAncestorModel} from 'core/models/SpaceAncestor';
import {bytesToUuid} from 'core/utils';
import {SpaceUserModel} from 'core/models/SpaceUser';
import {SubSpaceModel} from 'core/models/SubSpace';

const SpaceModel = types
  .model('Space', {
    id: types.maybe(types.string),
    name: types.maybe(types.string),
    secret: types.maybe(types.number),
    type: types.maybe(types.string),
    parentId: types.maybe(UUIDModel),
    description: types.maybe(types.string),
    kusamaOperatorId: types.maybe(types.string),
    adminAncestors: types.optional(types.array(SpaceAncestorModel), []),
    users: types.optional(types.array(SpaceUserModel), []),
    subSpaces: types.optional(types.array(SubSpaceModel), [])
  })
  .views((self) => ({
    get parentUUID() {
      return self.parentId ? bytesToUuid(self.parentId.data) : undefined;
    }
  }));

export interface SpaceModelInterface extends Instance<typeof SpaceModel> {}

export {SpaceModel};
