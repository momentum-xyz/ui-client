import {types} from 'mobx-state-tree';

import {ResetModel} from 'core/models';

const VibeStore = types.compose(
  ResetModel,
  types
    .model('VibeStore', {
      isVibe: false,
      vibeCount: 1
    })
    .actions((self) => ({
      toggleVibe() {
        self.isVibe = !self.isVibe;
      }
    }))
);

export {VibeStore};
