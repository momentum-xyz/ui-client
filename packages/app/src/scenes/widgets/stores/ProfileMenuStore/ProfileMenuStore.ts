import {types} from 'mobx-state-tree';
import {Dialog, ResetModel} from '@momentum/core';

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
      tokenRulesStore: types.optional(TokenRulesStore, {})
    })
    .actions((self) => ({
      openProfileMenu() {
        self.profileMenuDialog.open();
        self.menuDialog.open();
      }
    }))
);

export default ProfileMenuStore;
