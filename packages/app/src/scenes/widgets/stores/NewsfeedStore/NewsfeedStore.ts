import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {NewsfeedEntry, NewsfeedEntryModelInterface} from 'core/models';

enum NewsfeedTypeEnum {
  UNIVERSAL = 'universal',
  MY_CONNECTIONS = 'my_connections'
}

const NewsfeedStore = types.compose(
  ResetModel,
  types
    .model('NewsfeedStore', {
      newsfeedType: types.optional(
        types.enumeration(Object.values(NewsfeedTypeEnum)),
        NewsfeedTypeEnum.UNIVERSAL
      ),
      entries: types.optional(types.array(NewsfeedEntry), [])
    })
    .actions((self) => ({
      setActiveNewsfeedType(type: NewsfeedTypeEnum): void {
        self.newsfeedType = type;
      }
    }))
    .views((self) => ({
      get universalEntries(): NewsfeedEntryModelInterface[] {
        return self.entries.filter((entry) => entry.universal);
      },
      get connectionEntries(): NewsfeedEntryModelInterface[] {
        return self.entries.filter((entry) => !entry.universal);
      }
    }))
);

export {NewsfeedStore};
