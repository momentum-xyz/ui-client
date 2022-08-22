import {types} from 'mobx-state-tree';

import {DialogModel, ResetModel} from 'core/models';

import {TokenRuleReviewStore, TokenRulesStore} from './models';

const ProfileMenuStore = types.compose(
  ResetModel,
  types
    .model('ProfileMenuStore', {
      profileDialog: types.optional(DialogModel, {}),
      menuDialog: types.optional(DialogModel, {}),
      settingDialog: types.optional(DialogModel, {}),
      profileMenuDialog: types.optional(DialogModel, {}),
      tokenRulesDialog: types.optional(DialogModel, {}),
      tokenRuleReviewStore: types.optional(TokenRuleReviewStore, {isWorldList: true}),
      tokenRulesStore: types.optional(TokenRulesStore, {}),
      isSetting: false,
      isTokenRulesOpen: false
    })
    .actions((self) => ({
      openSetting() {
        self.isSetting = true;
      },
      closeSetting() {
        self.isSetting = false;
      },
      openTokenRulesPanel() {
        self.isTokenRulesOpen = true;
      },
      closeTokenRulesPanel() {
        self.isTokenRulesOpen = false;
      }
    }))
);

export default ProfileMenuStore;
