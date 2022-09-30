import {types, getSnapshot, applySnapshot} from 'mobx-state-tree';

// TODO: Move to sdk
const ResetModel = types
  .model('ResetModel', {})
  .actions((self) => {
    let initialState = {};

    return {
      afterCreate() {
        /** save a snapshot after the first initialising */
        initialState = getSnapshot(self);
      },
      resetModel() {
        /** back the initial state */
        applySnapshot(self, initialState);
      }
    };
  })
  .views(() => ({}));

export {ResetModel};
