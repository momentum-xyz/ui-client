import {Instance, types} from 'mobx-state-tree';

import {bytesToUuid} from 'core/utils';
import {UUIDModel} from 'core/models/UUID';

const SubSpaceModel = types
  .model('SpaceUser', {
    id: UUIDModel,
    name: types.string
  })
  .views((self) => ({
    get uuid() {
      return bytesToUuid(self.id.data);
    }
  }));

export interface SubSpaceModelInterface extends Instance<typeof SubSpaceModel> {}

export {SubSpaceModel};
