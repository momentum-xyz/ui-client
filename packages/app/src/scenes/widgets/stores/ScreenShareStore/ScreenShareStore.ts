import {flow, types} from 'mobx-state-tree';
import {t} from 'i18next';
import {Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';

import {api} from 'api';

const ScreenShareStore = types.compose(
  ResetModel,
  types
    .model('ScreenShareStore', {
      widget: types.optional(Dialog, {}),
      isExpanded: true,
      ownerRequest: types.optional(RequestModel, {}),
      request: types.optional(RequestModel, {}),
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

        const userId = agoraUserId.replace('ss|', '');
        const response = yield self.ownerRequest.send(api.userRepository_OLD.fetchProfile, {
          userId
        });

        if (response?.name) {
          self.screenOwnerId = userId;
          self.screenOwnerName = response.name;
        }
      }),
      // relayScreenShare: flow(function* (spaceId: string) {
      //   yield self.request.send(api.agoraRepository.relayScreenShare, {
      //     spaceId
      //   });
      // }),
      togglePage() {
        self.isExpanded = !self.isExpanded;
      }
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
