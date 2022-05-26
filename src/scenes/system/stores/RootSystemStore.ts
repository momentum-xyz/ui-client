import {Instance, types} from 'mobx-state-tree';

import {StoryBookStore} from './StoryBookStore';

const RootSystemStore = types.model('RootSystemStore', {
  storyBookStore: types.optional(StoryBookStore, {})
});

export interface RootDefaultStoreInterface extends Instance<typeof RootSystemStore> {}

export {RootSystemStore};
