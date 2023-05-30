import {cast, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';
import {NewsfeedEntryInterface} from '@momentum-xyz/ui-kit';

import {NewsfeedEntry, NewsfeedEntryModelInterface} from 'core/models';
import {NewsfeedTabTypeEnum} from 'core/enums';

const NewsfeedStore = types.compose(
  ResetModel,
  types
    .model('NewsfeedStore', {
      newsfeedType: types.optional(
        types.enumeration(Object.values(NewsfeedTabTypeEnum)),
        NewsfeedTabTypeEnum.UNIVERSAL
      ),
      entries: types.optional(types.array(NewsfeedEntry), [])
    })
    .actions((self) => ({
      setActiveNewsfeedType(type: NewsfeedTabTypeEnum): void {
        self.newsfeedType = type;
      },
      setEntries(entries: NewsfeedEntryInterface[]): void {
        self.entries = cast(entries);
      }
    }))
    .views((self) => ({
      get universalEntries(): NewsfeedEntryModelInterface[] {
        return self.entries.filter((entry) => entry.universal);
      },
      get connectionEntries(): NewsfeedEntryModelInterface[] {
        return self.entries.filter((entry) => !entry.universal);
      },
      get currentTabEntries(): NewsfeedEntryModelInterface[] {
        switch (self.newsfeedType) {
          case NewsfeedTabTypeEnum.UNIVERSAL:
            return this.universalEntries;
          case NewsfeedTabTypeEnum.MY_CONNECTIONS:
            return this.connectionEntries;
          default:
            return this.universalEntries;
        }
      }
    }))
);

export {NewsfeedStore};
