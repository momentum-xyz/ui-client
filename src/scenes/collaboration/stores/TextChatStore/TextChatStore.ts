import {types} from 'mobx-state-tree';

const TextChatStore = types
  .model('TextChatStore', {
    isOpen: false
  })
  .actions((self) => ({
    open(): void {
      self.isOpen = true;
    }
  }));

export {TextChatStore};
