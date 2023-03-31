import {types} from 'mobx-state-tree';
import {Dialog, ResetModel} from '@momentum-xyz/core';

// import {UnityService} from 'shared/services';

// TODO delete this store and use Instance3DStore instead??

const MinimapStore = types.compose(
  ResetModel,
  types
    .model('MinimapStore', {
      dialog: types.optional(Dialog, {})
    })
    .actions((self) => ({
      toggle() {
        // UnityService.toggleMiniMap();
        self.dialog.toggle();
      }
    }))
);

export {MinimapStore};
