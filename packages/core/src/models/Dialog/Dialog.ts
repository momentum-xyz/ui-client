import {types} from 'mobx-state-tree';

// TODO: Move to core package and remove 'Model' prefix
const Dialog = types
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

export {Dialog};
