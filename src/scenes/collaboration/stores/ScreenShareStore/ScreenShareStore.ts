import {types} from 'mobx-state-tree';
import {t} from 'i18next';

import {RequestModel, ResetModel} from 'core/models';

const ScreenShareStore = types.compose(
  ResetModel,
  types
    .model('ScreenShareStore', {
      request: types.optional(RequestModel, {}),
      screenOwnerId: types.maybeNull(types.string),
      isSettingUp: false
    })
    .actions((self) => ({
      setIsSettingUp(isSettingUp: boolean): void {
        self.isSettingUp = isSettingUp;
      },
      setScreenOwnerId(agoraUserId: string | null): void {
        self.screenOwnerId = agoraUserId ? agoraUserId.replace('ss|', '') : null;
      }
    }))
    .views((self) => ({
      get screenShareTitle(): string {
        return self.screenOwnerId
          ? `${t('labels.screenShare')} / ${self.screenOwnerId}`
          : t('labels.screenShare');
      }
    }))
);

export {ScreenShareStore};
