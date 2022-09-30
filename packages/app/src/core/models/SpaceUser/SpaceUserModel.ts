import {Instance, types} from 'mobx-state-tree';
import {UUIDModel} from '@momentum/core/dist/models/UUID';

import {bytesToUuid} from 'core/utils';

const SpaceUserModel = types
  .model('SpaceUser', {
    id: UUIDModel,
    name: types.string,
    isAdmin: types.maybe(types.boolean)
  })
  .views((self) => ({
    get uuid() {
      return bytesToUuid(self.id.data);
    }
  }));

export interface SpaceUserModelInterface extends Instance<typeof SpaceUserModel> {}

export {SpaceUserModel};
