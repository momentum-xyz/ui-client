import {Instance, types} from 'mobx-state-tree';

import {SortDirectionEnum} from '../../enums';

const SortedField = types.model('SortedField', {
  key: types.string,
  direction: types.frozen<SortDirectionEnum>()
});

export type SortedFieldModelType = Instance<typeof SortedField>;

export {SortedField};
