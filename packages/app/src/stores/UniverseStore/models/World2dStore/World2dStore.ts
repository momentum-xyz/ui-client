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
      worldInfo: types.maybeNull(WorldInfo),
      onlineUsersList: types.optional(types.array(UserDetails), [])
    })
    .actions((self) => ({
      init(worldId: string) {
        self.worldId = worldId;
        self.worldDetails = WorldDetails.create({worldId});
        this.subscribeToUsers();
      },
      subscribeToUsers(): void {
        Event3dEmitter.on('UserAdded', (onlineUser) => {
          this.addOnlineUser(onlineUser.id);
        });
        Event3dEmitter.on('UserRemoved', (userId) => {
          this.removeOnlineUser(userId);
        });
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
      }
    }))
    .views((self) => ({
      get isMyWorld(): boolean {
        return self.worldDetails?.world?.owner_id === getRootStore(self).sessionStore.userId;
      },
      get isCurrentUserWorldAdmin(): boolean {
        return this.isMyWorld;
      },
      get imageSrc(): string | null {
        return self.worldDetails?.world?.imageSrc || null;
      }
    }))
);

export {World2dStore};
