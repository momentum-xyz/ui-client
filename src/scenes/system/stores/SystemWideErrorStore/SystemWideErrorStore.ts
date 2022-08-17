import {types} from 'mobx-state-tree';

const SystemWideErrorStore = types
  .model('SystemWideErrorStore', {
    isDisconnected: false,
    isMaintenance: false
  })
  .actions((self) => ({
    setDisconnected() {
      self.isDisconnected = true;
    },
    setMaintenance() {
      self.isMaintenance = true;
    }
  }));

export {SystemWideErrorStore};
