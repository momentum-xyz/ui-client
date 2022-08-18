import {types} from 'mobx-state-tree';

import {StoryBookStore} from './StoryBookStore';

const RootSystemStore = types.model('RootSystemStore', {
  storyBookStore: types.optional(StoryBookStore, {})
});

export {RootSystemStore};
