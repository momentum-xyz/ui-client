import {types, cast} from 'mobx-state-tree';
import {Event3dEmitter, ResetModel} from '@momentum-xyz/core';

import {getRootStore} from 'core/utils';
import {UserDetails, WorldDetails, WorldInfo, WorldMembers} from 'core/models';

const World2dStore = types.compose(
  ResetModel,
  types
    .model('World2dStore', {
      worldId: types.optional(types.string, ''),
      worldDetails: types.maybeNull(WorldDetails),
      worldMembers: types.maybeNull(WorldMembers),
      onlineUsersList: types.optional(types.array(UserDetails), []),

      // FIXME: Removal
      worldInfo: types.maybeNull(WorldInfo)
    })
    .actions((self) => ({
      init(worldId: string) {
        self.worldId = worldId;
        self.worldDetails = WorldDetails.create({worldId});
        self.worldMembers = WorldMembers.create({worldId});
      },
      addOnlineUser(userId: string) {
        if (!self.onlineUsersList.find((u) => u.userId === userId)) {
          const userDetails = UserDetails.create({userId});
          self.onlineUsersList = cast([...self.onlineUsersList, userDetails]);
        }
      },
      removeOnlineUser(userId: string) {
        self.onlineUsersList = cast([
          ...self.onlineUsersList.filter((user) => user.userId !== userId)
        ]);
      },
      removeAllOnlineUsers() {
        self.onlineUsersList = cast([]);
      },
      onUserAdded(user: {id: string}) {
        this.addOnlineUser(user.id);
      },
      onUserRemoved(user: string) {
        this.removeOnlineUser(user);
      },
      onSetWorld() {
        this.removeAllOnlineUsers();
      }
    }))
    .actions((self) => ({
      subscribe: () => {
        Event3dEmitter.on('UserAdded', self.onUserAdded);
        Event3dEmitter.on('UserRemoved', self.onUserRemoved);
        Event3dEmitter.on('SetWorld', self.onSetWorld);
      },
      unsubscribe: () => {
        Event3dEmitter.off('UserAdded', self.onUserAdded);
        Event3dEmitter.off('UserRemoved', self.onUserRemoved);
        Event3dEmitter.off('SetWorld', self.onSetWorld);
      }
    }))
    .views((self) => ({
      get isMyWorld(): boolean {
        return self.worldDetails?.world?.owner_id === getRootStore(self).sessionStore.userId;
      },
      get isCurrentUserWorldAdmin(): boolean {
        return (
          this.isMyWorld ||
          // TODO world_details will have flag for admin, switch to it once ready
          self.worldMembers?.members?.some(
            (m) => m.user_id === getRootStore(self).sessionStore.userId
          ) ||
          false
        );
      },
      get image(): string | null {
        return self.worldDetails?.world?.avatarHash || null;
      },
      get imageSrc(): string | null {
        return self.worldDetails?.world?.imageSrc || null;
      }
    }))
);

export {World2dStore};
