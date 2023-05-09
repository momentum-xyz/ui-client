import {types, cast} from 'mobx-state-tree';
import {Event3dEmitter, ResetModel} from '@momentum-xyz/core';

import {getRootStore} from 'core/utils';
import {UserDetails, WorldDetails, WorldInfo} from 'core/models';

const World2dStore = types.compose(
  ResetModel,
  types
    .model('World2dStore', {
      worldId: types.optional(types.string, ''),
      worldDetails: types.maybeNull(WorldDetails),
      onlineUsersList: types.optional(types.array(UserDetails), []),

      // FIXME: Removal
      worldInfo: types.maybeNull(WorldInfo)
    })
    .actions((self) => ({
      init(worldId: string) {
        self.worldId = worldId;
        self.worldDetails = WorldDetails.create({worldId});
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
      }
    }))
    .actions((self) => {
      const onUserAdded = (user: {id: string}) => self.addOnlineUser(user.id);
      const onUserRemoved = (user: string) => self.removeOnlineUser(user);
      const onSetWorld = (/*world,userId*/) => self.removeAllOnlineUsers();
      return {
        afterCreate: () => {
          Event3dEmitter.on('UserAdded', onUserAdded);
          Event3dEmitter.on('UserRemoved', onUserRemoved);
          Event3dEmitter.on('SetWorld', onSetWorld);
        },
        beforeDestroy: () => {
          Event3dEmitter.off('UserAdded', onUserAdded);
          Event3dEmitter.off('UserRemoved', onUserRemoved);
          Event3dEmitter.off('SetWorld', onSetWorld);
        }
      };
    })
    .views((self) => ({
      get isMyWorld(): boolean {
        return self.worldDetails?.world?.owner_id === getRootStore(self).sessionStore.userId;
      },
      get isCurrentUserWorldAdmin(): boolean {
        return this.isMyWorld;
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
