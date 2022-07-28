import {types} from 'mobx-state-tree';

import {DialogModel, ResetModel} from 'core/models';

const SettingsStore = types.compose(
  ResetModel,
  types.model('SettingsStore', {
    dialog: types.optional(DialogModel, {})
  })
);

export {SettingsStore};
