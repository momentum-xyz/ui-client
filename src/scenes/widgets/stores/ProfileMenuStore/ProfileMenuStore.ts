import {types} from 'mobx-state-tree';

import {DialogModel, ResetModel} from 'core/models';

const ProfileMenuStore = types.compose(
  ResetModel,
  types
    .model('ProfileMenuStore', {
      profileDialog: types.optional(DialogModel, {}),
      profileMenuDialog: types.optional(DialogModel, {}),
      isSetting: false
    })
    .actions((self) => ({
      openSetting() {
        self.isSetting = true;
      },
      closeSetting() {
        self.isSetting = false;
      }
    }))
);

export default ProfileMenuStore;
