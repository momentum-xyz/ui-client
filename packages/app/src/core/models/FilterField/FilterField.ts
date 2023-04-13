import {Instance, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

const FilterField = types
  .compose(
    ResetModel,
    types.model('FilterField', {
      fieldName: ''
    })
  )
  .actions((self) => ({
    setField(fieldName: string): void {
      self.fieldName = fieldName;
    }
  }));

export type FilterFieldModelType = Instance<typeof FilterField>;

export {FilterField};
