import {types} from 'mobx-state-tree';
import {Dialog, ResetModel} from '@momentum-xyz/core';

import {MagicLink} from './models';

const MagicLinkStore = types.compose(
  ResetModel,
  types.model('MagicLinkStore', {
    magicLinkDialog: types.optional(Dialog, {}),
    magicLink: types.optional(MagicLink, {})
  })
);

export {MagicLinkStore};
