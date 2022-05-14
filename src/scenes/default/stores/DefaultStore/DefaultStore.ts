import {types} from 'mobx-state-tree';

import {ResetModel} from 'core/models';

const DefaultStore = types.compose(
  ResetModel,
  types
    .model('DefaultStore', {
      isActive: true
    })
    .actions((self) => ({
      toggleIsActive(): void {
        self.isActive = !self.isActive;
      }
    }))
    .views((self) => ({
      get isDisabled(): boolean {
        return !self.isActive;
      }
    }))
);

export {DefaultStore};
