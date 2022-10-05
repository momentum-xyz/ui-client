import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum/sdk';

import {DialogModel} from 'core/models';

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
