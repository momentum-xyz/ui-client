import {types} from 'mobx-state-tree';

import {DialogModel, ResetModel} from 'core/models';

const HelpStore = types.compose(
  ResetModel,
  types.model('HelpStore', {
    helpDialog: types.optional(DialogModel, {})
  })
);

export {HelpStore};
