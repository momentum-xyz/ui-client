import {Instance, types} from 'mobx-state-tree';

import {SortDirection} from 'core/enums';

const SortedFieldModel = types.model('SortedField', {
  key: types.string,
  direction: types.frozen<SortDirection>()
});

export interface SortedFieldModelInterface extends Instance<typeof SortedFieldModel> {}

export {SortedFieldModel};
