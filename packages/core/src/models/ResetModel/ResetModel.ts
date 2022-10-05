import {types, getSnapshot, applySnapshot, ModelActions} from 'mobx-state-tree';

interface ActionsInterface extends ModelActions {
  resetModel: () => void;
}

// TODO: Move to sdk
const ResetModel = types.model('ResetModel', {}).actions<ActionsInterface>((self) => {
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
});

export {ResetModel};
