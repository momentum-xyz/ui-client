import {types, Instance} from 'mobx-state-tree';
import {TimelineTypeEnum} from '@momentum-xyz/core';

import {TimelineEntryData} from './models';

const TimelineEntry = types.model('TimelineEntry', {
  activity_id: types.string,
  created_at: types.string,
  object_id: types.string,
  world_name: types.string,
  world_avatar_hash: types.maybeNull(types.string),
  user_id: types.string,
  user_name: types.string,
  avatar_hash: types.maybeNull(types.string),
  type: types.enumeration(Object.values(TimelineTypeEnum)),
  data: TimelineEntryData
});

export interface TimelineEntryModelInterface extends Instance<typeof TimelineEntry> {}

export {TimelineEntry};
