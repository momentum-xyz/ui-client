import {Instance, types} from 'mobx-state-tree';

import {SortDirectionEnum} from 'core/enums';

const SortedFieldModel = types.model('SortedField', {
  key: types.string,
  direction: types.frozen<SortDirectionEnum>()
});

export interface SortedFieldModelInterface extends Instance<typeof SortedFieldModel> {}

export {SortedFieldModel};
