import {Instance, types} from 'mobx-state-tree';

const Content = types
  .model('Content', {
    text: types.maybeNull(types.string),
    title: types.maybeNull(types.string),
    type: types.maybeNull(types.string),
    url: types.maybeNull(types.string)
  })
  .views((self) => ({}));

export interface ContentInterface extends Instance<typeof Content> {}

export {Content};
