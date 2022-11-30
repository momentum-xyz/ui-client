import {cast, flow, types} from 'mobx-state-tree';
import {t} from 'i18next';
import {Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, SpaceAttributeItemResponse, SpaceInterface} from 'api';
import {mapper} from 'api/mapper';
import {Space} from 'core/models';

const ScreenShareStore = types.compose(
  ResetModel,
  types
    .model('ScreenShareStore', {
      widget: types.optional(Dialog, {}),
      isExpanded: true,
      ownerRequest: types.optional(RequestModel, {}),
      request: types.optional(RequestModel, {}),
      world: types.maybeNull(Space),
      worldRequest: types.optional(RequestModel, {}),

      screenOwnerId: types.maybeNull(types.string),
      screenOwnerName: types.maybeNull(types.string)
    })
    .actions((self) => ({
      setScreenOwner: flow(function* (agoraUserId: string | null) {
        if (!agoraUserId) {
          self.screenOwnerId = null;
          self.screenOwnerName = null;
          return;
        }

        const response = yield self.ownerRequest.send(api.userRepository_OLD.fetchProfile, {
          userId: agoraUserId
        });

        if (response?.name) {
          self.screenOwnerId = agoraUserId;
          self.screenOwnerName = response.name;
        }
      }),
      togglePage() {
        self.isExpanded = !self.isExpanded;
      },
      fetchWorld: flow(function* (spaceId: string) {
        const response: SpaceAttributeItemResponse = yield self.worldRequest.send(
          api.spaceRepository.fetchSpace,
          {spaceId}
        );

        if (response) {
          self.world = cast({
            id: spaceId,
            ...mapper.mapSpaceSubAttributes<SpaceInterface>(response)
          });
        }
      })
    }))
    .views((self) => ({
      get screenShareTitle(): string {
        return self.screenOwnerName
          ? `${t('labels.screenShare')} / ${self.screenOwnerName}`
          : t('labels.screenShare');
      }
    }))
);

export {ScreenShareStore};
