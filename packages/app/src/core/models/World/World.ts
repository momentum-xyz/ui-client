import {Instance, types} from 'mobx-state-tree';
import {ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {getImageAbsoluteUrl} from 'core/utils';
import {WorldStaker} from 'core/models/WorldStaker';

const World = types
  .model('World', {
    id: types.string,
    name: types.string,
    description: types.maybeNull(types.string),
    website_link: types.maybeNull(types.string),
    createdAt: types.maybe(types.string),
    avatarHash: types.maybeNull(types.string),
    last_staking_comment: types.maybeNull(types.string),
    owner_id: types.string,
    owner_name: types.maybeNull(types.string),
    stake_total: types.maybeNull(types.string),
    stakers: types.maybeNull(types.optional(types.array(WorldStaker), [])),
    is_admin: types.optional(types.boolean, false)
  })
  .views((self) => ({
    get imageSrc(): string | null {
      return getImageAbsoluteUrl(self.avatarHash);
    },
    get imageLargeSrc(): string | null {
      return getImageAbsoluteUrl(self.avatarHash, ImageSizeEnum.S5);
    },
    get momStaked(): string {
      return self.stake_total || '0';
    },
    get stakersCount(): number {
      return self.stakers?.length || 0;
    }
  }));

export interface WorldModelInterface extends Instance<typeof World> {}

export {World};
