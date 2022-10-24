import {Instance, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {OnlineUsersList} from 'core/models';

const OnlineUsersStore = types
  .compose(
    ResetModel,
    types.model('OnlineUsersStore', {
      onlineUsersList: types.optional(OnlineUsersList, {}),
      expanded: true,
      selectedUserId: types.maybe(types.string),
      editedUserId: types.maybe(types.string),
      usersRequest: types.optional(RequestModel, {}),
      searchUsersRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    toggleExpand(expanded?: boolean) {
      if (expanded !== undefined) {
        self.expanded = expanded;
      } else {
        self.expanded = !self.expanded;
      }
    },
    selectUser(userId: string) {
      self.selectedUserId = userId;
    },
    unselectUser() {
      self.selectedUserId = undefined;
    },
    editUser(userId: string) {
      self.editedUserId = userId;
    },
    endEditingUser() {
      self.editedUserId = undefined;
    }
  }));

export type OnlineUsersStoreType = Instance<typeof OnlineUsersStore>;

export {OnlineUsersStore};
