import {types, cast, flow} from 'mobx-state-tree';
import {RequestModel} from '@momentum/core';

import {StageModePopupInfoInterface, StageModePopupOptionsInterface} from 'core/interfaces';
import {StageModePopupTypeEnum} from 'core/enums';
import {api, ProfileResponse} from 'api';

const StageModeStore = types
  .model('StageModeStore', {
    popups: types.array(types.frozen<StageModePopupInfoInterface>()),
    acceptedRequestToJoinStage: types.maybe(types.boolean),

    request: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    addRequestPopup: flow(function* (userId: string, options?: StageModePopupOptionsInterface) {
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
    addAwaitingPermissionPopup(options?: StageModePopupOptionsInterface) {
      self.popups.push({
        type: StageModePopupTypeEnum.AWAITING_PERMISSION,
        ...options
      });
    },
    removeRequestPopup(userId: string) {
      self.popups = cast(
        self.popups.filter(
          (popup) =>
            popup.type === StageModePopupTypeEnum.RECEIVED_PERMISSION_REQUEST &&
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
    },
    setAcceptedRequestToJoinStage(acceptedRequestToJoinStage: boolean | undefined) {
      self.acceptedRequestToJoinStage = acceptedRequestToJoinStage;
    }
  }));

export {StageModeStore};
