import {types, Instance} from 'mobx-state-tree';
import {NewsfeedTypeEnum} from '@momentum-xyz/core';

const NewsFeedEntryData = types.model('NewsFeedEntryData', {
  world_id: types.optional(types.maybeNull(types.string), null),
  world_name: types.optional(types.maybeNull(types.string), null),
  world_image: types.optional(types.maybeNull(types.string), null),

  user_name: types.optional(types.maybeNull(types.string), null),
  amount: types.optional(types.maybeNull(types.number), null),

  image: types.optional(types.maybeNull(types.string), null),
  video: types.optional(types.maybeNull(types.string), null),
  // world_id: types.optional(types.maybeNull(types.string), null),
  comment: types.optional(types.maybeNull(types.string), null)
});

const NewsfeedEntry = types.model('NewsfeedEntry', {
  id: types.string,
  author_name: types.string,
  author_id: types.string,
  author_avatar: types.maybeNull(types.string),
  universal: types.optional(types.boolean, true),
  entry_type: types.enumeration(Object.values(NewsfeedTypeEnum)),
  created_at: types.string,
  data: NewsFeedEntryData
});

export interface NewsfeedEntryModelInterface extends Instance<typeof NewsfeedEntry> {}

export {NewsfeedEntry};
