import {types} from 'mobx-state-tree';

const DialogModel = types
  .model('Dialog', {
    isOpen: false
  })
  .actions((self) => ({
    open(): void {
      self.isOpen = true;
    },
    close(): void {
      self.isOpen = false;
    },
    toggle(): void {
      self.isOpen = !self.isOpen;
    }
  }));

export {DialogModel};
