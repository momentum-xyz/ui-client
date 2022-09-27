import {flow, types} from 'mobx-state-tree';
import {t} from 'i18next';

import {api} from 'api';
import {RequestModel, ResetModel} from 'core/models';

const ScreenShareStore = types.compose(
  ResetModel,
  types
    .model('ScreenShareStore', {
      ownerRequest: types.optional(RequestModel, {}),
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
        const response = yield self.ownerRequest.send(api.userRepository.fetchProfile, {userId});

        if (response?.name) {
          self.screenOwnerId = userId;
          self.screenOwnerName = response.name;
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
