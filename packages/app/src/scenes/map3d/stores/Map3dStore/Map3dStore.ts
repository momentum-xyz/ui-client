import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, FetchUserResponse} from 'api';
import {NftItem, NftItemInterface} from 'stores/NftStore/models';
import {OdysseyItemInterface} from 'scenes/explore/stores';
import {User} from 'core/models';

const Map3dStore = types
  .compose(
    ResetModel,
    types.model('Map3dStore', {
      selectedNft: types.maybeNull(types.reference(NftItem)),
      selectedUser: types.maybeNull(User),
      userRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    selectOdyssey: flow(function* (item: NftItemInterface) {
      self.selectedUser = null;
      self.selectedNft = cast(item);

      const user: FetchUserResponse = yield self.userRequest.send(api.userRepository.fetchUser, {
        userId: item.uuid
      });
      if (user) {
        self.selectedUser = cast(user);
      }
    }),
    unselectOdyssey(): void {
      self.selectedNft = null;
      self.selectedUser = null;
    }
  }))
  .views((self) => ({
    get selectedOdyssey(): OdysseyItemInterface | null {
      if (!self.selectedNft) {
        return null;
      }

      return {
        ...self.selectedNft,
        image: self.selectedUser?.avatarSrc || self.selectedNft.image,
        connections: 0,
        docking: 0,
        events: 0
      };
    }
  }));

export {Map3dStore};
