import {types} from 'mobx-state-tree';

import {DialogModel, ResetModel} from 'core/models';

import {MagicLink} from './models';

const MagicLinkStore = types.compose(
  ResetModel,
  types.model('MagicLinkStore', {
    magicLinkDialog: types.optional(DialogModel, {}),
    magicLink: types.optional(MagicLink, {})
  })
);

export {MagicLinkStore};
