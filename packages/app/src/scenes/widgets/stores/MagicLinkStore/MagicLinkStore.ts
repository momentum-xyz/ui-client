import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum/sdk';

import {DialogModel} from 'core/models';

import {MagicLink} from './models';

const MagicLinkStore = types.compose(
  ResetModel,
  types.model('MagicLinkStore', {
    magicLinkDialog: types.optional(DialogModel, {}),
    magicLink: types.optional(MagicLink, {})
  })
);

export {MagicLinkStore};
