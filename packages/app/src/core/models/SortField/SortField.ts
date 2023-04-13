import {Instance, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

const SortField = types
  .compose(
    ResetModel,
    types.model('SortField', {
      fieldName: ''
    })
  )
  .actions((self) => ({
    setField(fieldName: string): void {
      self.fieldName = fieldName;
    }
  }));

export type SortFieldModelType = Instance<typeof SortField>;

export {SortField};
