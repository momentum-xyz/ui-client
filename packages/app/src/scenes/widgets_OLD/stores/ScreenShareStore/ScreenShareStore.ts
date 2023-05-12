import {flow, types} from 'mobx-state-tree';
import {Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';
import {i18n} from '@momentum-xyz/core';

import {api} from 'api';

const ScreenShareStore = types.compose(
  ResetModel,
  types
    .model('ScreenShareStore', {
      dialog: types.optional(Dialog, {}),
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

        const response = yield self.ownerRequest.send(api.userRepository.fetchUser, {
          userId: agoraUserId
        });

        if (response?.name) {
          self.screenOwnerId = agoraUserId;
          self.screenOwnerName = response.name;
        }
      }),
      togglePage() {
        self.isExpanded = !self.isExpanded;
      }
    }))
    .views((self) => ({
      get screenShareTitle(): string {
        return self.screenOwnerName
          ? `${i18n.t('labels.screenShare')} / ${self.screenOwnerName}`
          : i18n.t('labels.screenShare');
      }
    }))
);

export {ScreenShareStore};
