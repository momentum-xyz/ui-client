import {types, cast, flow} from 'mobx-state-tree';

import {StageModePopupInfoInterface} from 'core/interfaces';
import {StageModePopupTypeEnum} from 'core/enums';
import {RequestModel} from 'core/models';
import {api, ProfileResponse} from 'api';

const StageModeStore = types
  .model('StageModeStore', {
    popups: types.array(types.frozen<StageModePopupInfoInterface>()),

    request: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    // TODO: Remove after refactoring
    initWithDummies() {
      self.popups.push({
        userId: 'sjksjsjkdaldalsjd',
        type: StageModePopupTypeEnum.RECEIVED_PERMISSION_REQUEST,
        user: 's',
        userName: 'Daniel',
        onAccept: async () => {
          return Promise.resolve(true);
        },
        onDecline: async () => {
          return Promise.resolve(true);
        }
      });

      self.popups.push({
        userId: 'sjksjsjkdaldal',
        type: StageModePopupTypeEnum.AWAITING_PERMISSION,
        onAccept: async () => {
          return Promise.resolve(true);
        },
        onDecline: async () => {
          return Promise.resolve(true);
        }
      });
    },
    addRequestPopup: flow(function* (
      userId: string,
      options?: Omit<StageModePopupInfoInterface, 'type'>
    ) {
      const response: ProfileResponse = yield self.request.send(api.userRepository.fetchProfile, {
        userId
      });

      self.popups.push({
        userId,
        userName: response?.name,
        type: StageModePopupTypeEnum.RECEIVED_PERMISSION_REQUEST,
        ...options
      });
    }),
    addAwaitingPermissionPopup(options?: Omit<StageModePopupInfoInterface, 'type'>) {
      self.popups.push({
        type: StageModePopupTypeEnum.AWAITING_PERMISSION,
        ...options
      });
    },
    removeRequestPopup(userId: string) {
      self.popups = cast(
        self.popups.filter(
          (popup) =>
            popup.type !== StageModePopupTypeEnum.RECEIVED_PERMISSION_REQUEST &&
            popup.userId !== userId
        )
      );
    },
    removeAwaitingPermissionPopup() {
      self.popups = cast(
        self.popups.filter((popup) => popup.type !== StageModePopupTypeEnum.AWAITING_PERMISSION)
      );
    },
    removeAllPopups() {
      self.popups = cast([]);
    }
  }));

export {StageModeStore};
