import {types} from 'mobx-state-tree';

import {StoryBookStore} from './StoryBookStore';
import {SystemWideErrorStore} from './SystemWideErrorStore';

const RootSystemStore = types.model('RootSystemStore', {
  storyBookStore: types.optional(StoryBookStore, {}),
  systemWideErrorStore: types.optional(SystemWideErrorStore, {})
});

export {RootSystemStore};
