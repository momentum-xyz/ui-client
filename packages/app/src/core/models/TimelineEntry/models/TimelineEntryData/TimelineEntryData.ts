import {types, Instance} from 'mobx-state-tree';

const TimelineEntryData = types.model('TimelineEntryData', {
  hash: types.maybeNull(types.string),
  description: types.maybeNull(types.string),
  token_amount: types.maybeNull(types.string),
  token_symbol: types.maybeNull(types.string)
});

export interface TimelineEntryDataModelInterface extends Instance<typeof TimelineEntryData> {}

export {TimelineEntryData};
