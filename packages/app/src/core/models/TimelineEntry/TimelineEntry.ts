import {types, Instance} from 'mobx-state-tree';
import {PostTypeEnum} from '@momentum-xyz/core';

import {TimelineEntryData} from './models';

const TimelineEntry = types.model('TimelineEntry', {
  activity_id: types.string,
  created_at: types.string,
  object_id: types.string,
  user_id: types.string,
  type: types.enumeration(Object.values(PostTypeEnum)),
  data: TimelineEntryData
});

export interface TimelineEntryModelInterface extends Instance<typeof TimelineEntry> {}

export {TimelineEntry};
