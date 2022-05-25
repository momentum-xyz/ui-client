import {types} from 'mobx-state-tree';

import {ResetModel} from 'core/models';
import {ExploreStore} from 'scenes/widgets/stores/ExploreStore';
import {OnlineUsersStore} from 'scenes/widgets/stores/OnlineUsersStore';

const HomeStore = types.compose(
  ResetModel,
  types
    .model('HomeStore', {
      isActive: true,
      onlineUsersStore: types.optional(OnlineUsersStore, {}),
      exploreStore: types.optional(ExploreStore, {})
    })
    .actions((self) => ({
      toggleIsActive(): void {
        self.isActive = !self.isActive;
      }
    }))
    .views((self) => ({
      get isDisabled(): boolean {
        return !self.isActive;
      }
    }))
);

export {HomeStore};
