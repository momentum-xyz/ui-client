import {types} from 'mobx-state-tree';

import {DialogModel, ResetModel} from 'core/models';

const ProfileMenuStore = types.compose(
  ResetModel,
  types.model('ProfileMenuStore', {
    profileDialog: types.optional(DialogModel, {}),
    profileMenuDialog: types.optional(DialogModel, {})
  })
);

export default ProfileMenuStore;
