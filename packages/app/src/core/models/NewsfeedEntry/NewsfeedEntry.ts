import {types, Instance} from 'mobx-state-tree';

import {NewsfeedTypeEnum} from 'core/enums';

import {UserProfile} from '../UserProfile';
import {WorldInfo} from '../WorldInfo';

const NewsfeedEntry = types.model('NewsfeedEntry', {
  id: types.string,
  author: UserProfile,
  universal: types.optional(types.boolean, true),
  entry_type: types.enumeration(Object.values(NewsfeedTypeEnum)),
  created_at: types.string,
  worldInfo: WorldInfo
});

export interface NewsfeedEntryModelInterface extends Instance<typeof NewsfeedEntry> {}

export {NewsfeedEntry};
