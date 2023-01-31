import {types} from 'mobx-state-tree';
import {Dialog, ResetModel} from '@momentum-xyz/core';

import {NftItem, NftItemModelInterface} from 'core/models';

const PreviewOdysseyStore = types.compose(
  ResetModel,
  types
    .model('PreviewOdysseyStore', {
      dialog: types.optional(Dialog, {}),
      nft: types.maybe(types.reference(NftItem))
    })
    .actions((self) => ({
      open(nft: NftItemModelInterface) {
        self.nft = nft;
        self.dialog.open();
      }
    }))
);

export {PreviewOdysseyStore};
