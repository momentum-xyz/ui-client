import {Instance, types} from 'mobx-state-tree';

const Content = types
  .model('Content', {
    text: types.maybe(types.string),
    title: types.maybe(types.string),
    type: types.maybe(types.string),
    url: types.maybe(types.string)
  })
  .views((self) => ({}));

export interface ContentInterface extends Instance<typeof Content> {}

export {Content};
