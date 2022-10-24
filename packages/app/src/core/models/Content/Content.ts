import {Instance, types} from 'mobx-state-tree';

// TODO: Rename to TileContent
const Content = types.model('Content', {
  text: types.maybe(types.string),
  title: types.maybe(types.string),
  type: types.maybe(types.string),
  url: types.maybe(types.string)
});

// TODO: Change to type
export interface ContentInterface extends Instance<typeof Content> {}

export {Content};
