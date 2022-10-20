import {flow, types} from 'mobx-state-tree';
import {Dialog, RequestModel, ResetModel, UserStatusEnum} from '@momentum-xyz/core';

import {api} from 'api';

import {TokenRuleReviewStore, TokenRulesStore} from './models';

const ProfileMenuStore = types.compose(
  ResetModel,
  types
    .model('ProfileMenuStore', {
      profileDialog: types.optional(Dialog, {}),
      menuDialog: types.optional(Dialog, {}),
      settingDialog: types.optional(Dialog, {}),
      profileMenuDialog: types.optional(Dialog, {}),
      tokenRulesDialog: types.optional(Dialog, {}),
      tokenRuleReviewStore: types.optional(TokenRuleReviewStore, {isWorldList: true}),
      tokenRulesStore: types.optional(TokenRulesStore, {}),
      statusRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      openProfileMenu(): void {
        self.profileMenuDialog.open();
        self.menuDialog.open();
      },
      changeStatus: flow(function* (status: UserStatusEnum) {
        yield self.statusRequest.send(api.statusRepository.changeStatus, {status});
      })
    }))
);

export default ProfileMenuStore;
