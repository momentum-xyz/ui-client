import {types, Instance} from 'mobx-state-tree';

const TimelineEntryData = types.model('TimelineEntryData', {
  hash: types.string,
  description: types.string
});

export interface TimelineEntryDataModelInterface extends Instance<typeof TimelineEntryData> {}

export {TimelineEntryData};
