import {Instance, types} from 'mobx-state-tree';

import {getImageAbsoluteUrl} from 'core/utils';

const WorldInfo = types
  .model('WorldInfo', {
    id: types.identifier,
    name: types.string,
    description: types.maybeNull(types.string),
    website_link: types.maybeNull(types.string),
    avatarHash: types.maybeNull(types.string),
    owner_id: types.string,
    owner_name: types.maybeNull(types.string),
    stake_total: types.maybe(types.string)
  })
  .views((self) => ({
    get imageSrc(): string | null {
      return getImageAbsoluteUrl(self.avatarHash);
    }
  }));

export interface WorldInfoModelInterface extends Instance<typeof WorldInfo> {}

export {WorldInfo};
