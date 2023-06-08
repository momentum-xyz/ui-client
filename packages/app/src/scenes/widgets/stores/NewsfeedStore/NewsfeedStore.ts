import {cast, types} from 'mobx-state-tree';
import {ResetModel, NewsfeedTypeEnum} from '@momentum-xyz/core';
import {NewsfeedEntryInterface} from '@momentum-xyz/ui-kit';

import {NewsfeedEntry, NewsfeedEntryModelInterface} from 'core/models';
import {NewsfeedTabTypeEnum} from 'core/enums';
import {getRootStore} from 'core/utils';

const generateDummyItems = (
  worldName: string | null,
  worldId: string | null,
  page: number,
  universal: boolean
) => {
  const dummyEntries: NewsfeedEntryInterface[] = [
    {
      id: `page_${page}_1`,
      author_id: 'user_1',
      author_name: 'John Doe',
      author_avatar: 'https://picsum.photos/201',
      author_world_id: worldId,
      author_world_name: worldName,
      universal,
      entry_type: NewsfeedTypeEnum.CREATED,
      created_at: new Date().toDateString(),
      data: {
        world_id: worldId,
        world_name: 'Odyssey World 1',
        world_image: 'https://picsum.photos/301',
        user_name: 'John Doe',
        amount: null
      }
    },
    {
      id: `page_${page}_2`,
      author_id: 'user_2',
      author_name: 'John Doe',
      author_avatar: 'https://picsum.photos/202',
      author_world_id: worldId,
      author_world_name: worldName,
      universal,
      entry_type: NewsfeedTypeEnum.BOOST,
      created_at: new Date().toDateString(),
      data: {
        world_id: worldId,
        world_name: 'Odyssey World 1',
        world_image: 'https://picsum.photos/302',
        user_name: 'Booster man',
        amount: 100
      }
    },
    {
      id: `page_${page}_3`,
      author_id: 'user_3',
      author_name: 'Jane Doe',
      author_avatar: 'https://picsum.photos/203',
      author_world_id: worldId,
      author_world_name: worldName,
      universal,
      entry_type: NewsfeedTypeEnum.CREATED,
      created_at: new Date().toDateString(),
      data: {
        world_id: worldId,
        world_name: 'Odyssey World 2',
        world_image: 'https://picsum.photos/303',
        user_name: 'Jane Doe',
        amount: null
      }
    },
    {
      id: `page_${page}_4`,
      author_id: 'user_3',
      author_name: 'Jane Doe',
      author_avatar: 'https://picsum.photos/203',
      author_world_id: worldId,
      author_world_name: 'World Jane',
      universal,
      entry_type: NewsfeedTypeEnum.IMAGE,
      created_at: new Date().toString(),
      data: {
        world_id: 'odyssey_world_1',
        image: 'https://picsum.photos/309',
        video: null,
        comment: null
      }
    },
    {
      id: `page_${page}_5`,
      author_id: 'user_4',
      author_name: 'John Doe',
      author_avatar: 'https://picsum.photos/204',
      author_world_id: worldId,
      author_world_name: 'World John',
      universal,
      entry_type: NewsfeedTypeEnum.IMAGE,
      created_at: new Date().toString(),
      data: {
        world_id: 'odyssey_world_1',
        image: 'https://picsum.photos/303',
        video: null,
        comment: 'Lorem ipsum dolor sit amet.'
      }
    },
    {
      id: `page_${page}_6`,
      author_id: 'user_4',
      author_name: 'John Doe',
      author_avatar: 'https://picsum.photos/204',
      author_world_id: worldId,
      author_world_name: worldName,
      universal,
      entry_type: NewsfeedTypeEnum.BOOST,
      created_at: new Date().toDateString(),
      data: {
        world_id: worldId,
        world_name: 'Odyssey World 2',
        world_image: 'https://picsum.photos/304',
        user_name: 'Booster man',
        amount: 49
      }
    },
    {
      id: `page_${page}_7`,
      author_id: 'user_5',
      author_name: 'John Doe',
      author_avatar: 'https://picsum.photos/203',
      author_world_id: worldId,
      author_world_name: worldName,
      universal,
      entry_type: NewsfeedTypeEnum.CREATED,
      created_at: new Date().toDateString(),
      data: {
        world_id: worldId,
        world_name: 'Odyssey World 2',
        world_image: 'https://picsum.photos/303',
        user_name: 'John Doe',
        amount: null
      }
    },
    {
      id: `page_${page}_8`,
      author_id: 'user_5',
      author_name: 'John Doe',
      author_avatar: 'https://picsum.photos/203',
      author_world_id: worldId,
      author_world_name: 'World John',
      universal,
      entry_type: NewsfeedTypeEnum.IMAGE,
      created_at: new Date().toString(),
      data: {
        world_id: null,
        image: 'https://picsum.photos/403',
        video: null,
        comment: null
      }
    },
    {
      id: `page_${page}_9`,
      author_id: 'user_6',
      author_name: 'Jane Doe',
      author_avatar: 'https://picsum.photos/204',
      author_world_id: worldId,
      author_world_name: worldName,
      universal,
      entry_type: NewsfeedTypeEnum.BOOST,
      created_at: new Date().toDateString(),
      data: {
        world_id: worldId,
        world_name: 'Odyssey World 2',
        world_image: 'https://picsum.photos/304',
        user_name: 'Booster man',
        amount: 49
      }
    },
    {
      id: `page_${page}_9____1`,
      author_id: 'user_6',
      author_name: 'Jane Doe',
      author_avatar: 'https://picsum.photos/204',
      author_world_id: worldId,
      author_world_name: worldName,
      universal,
      entry_type: NewsfeedTypeEnum.BOOST,
      created_at: new Date().toDateString(),
      data: {
        world_id: worldId,
        world_name: 'Odyssey World 2',
        world_image: 'https://picsum.photos/304',
        user_name: 'Booster man',
        amount: 49
      }
    }
    // {
    //   id: `page_${page}_9___2`,
    //   author_id: 'user_6',
    //   author_name: 'Jane Doe',
    //   author_avatar: 'https://picsum.photos/204',
    //   author_world_id: worldId,
    //   author_world_name: worldName,
    //   universal,
    //   entry_type: NewsfeedTypeEnum.BOOST,
    //   created_at: new Date().toDateString(),
    //   data: {
    //     world_id: worldId,
    //     world_name: 'Odyssey World 2',
    //     world_image: 'https://picsum.photos/304',
    //     user_name: 'Booster man',
    //     amount: 49
    //   }
    // },
    // {
    //   id: `page_${page}_9___3`,
    //   author_id: 'user_6',
    //   author_name: 'Jane Doe',
    //   author_avatar: 'https://picsum.photos/204',
    //   author_world_id: worldId,
    //   author_world_name: worldName,
    //   universal,
    //   entry_type: NewsfeedTypeEnum.BOOST,
    //   created_at: new Date().toDateString(),
    //   data: {
    //     world_id: worldId,
    //     world_name: 'Odyssey World 2',
    //     world_image: 'https://picsum.photos/304',
    //     user_name: 'Booster man',
    //     amount: 49
    //   }
    // },
    // {
    //   id: `page_${page}_9___4`,
    //   author_id: 'user_6',
    //   author_name: 'Jane Doe',
    //   author_avatar: 'https://picsum.photos/204',
    //   author_world_id: worldId,
    //   author_world_name: worldName,
    //   universal,
    //   entry_type: NewsfeedTypeEnum.BOOST,
    //   created_at: new Date().toDateString(),
    //   data: {
    //     world_id: worldId,
    //     world_name: 'Odyssey World 2',
    //     world_image: 'https://picsum.photos/304',
    //     user_name: 'Booster man',
    //     amount: 49
    //   }
    // },
    // {
    //   id: `page_${page}_9___5`,
    //   author_id: 'user_6',
    //   author_name: 'Jane Doe',
    //   author_avatar: 'https://picsum.photos/204',
    //   author_world_id: worldId,
    //   author_world_name: worldName,
    //   universal,
    //   entry_type: NewsfeedTypeEnum.BOOST,
    //   created_at: new Date().toDateString(),
    //   data: {
    //     world_id: worldId,
    //     world_name: 'Odyssey World 2',
    //     world_image: 'https://picsum.photos/304',
    //     user_name: 'Booster man',
    //     amount: 49
    //   }
    // },
    // {
    //   id: `page_${page}_9___6`,
    //   author_id: 'user_6',
    //   author_name: 'Jane Doe',
    //   author_avatar: 'https://picsum.photos/204',
    //   author_world_id: worldId,
    //   author_world_name: worldName,
    //   universal,
    //   entry_type: NewsfeedTypeEnum.BOOST,
    //   created_at: new Date().toDateString(),
    //   data: {
    //     world_id: worldId,
    //     world_name: 'Odyssey World 2',
    //     world_image: 'https://picsum.photos/304',
    //     user_name: 'Booster man',
    //     amount: 49
    //   }
    // },
    // {
    //   id: `page_${page}_9___7`,
    //   author_id: 'user_6',
    //   author_name: 'Jane Doe',
    //   author_avatar: 'https://picsum.photos/204',
    //   author_world_id: worldId,
    //   author_world_name: worldName,
    //   universal,
    //   entry_type: NewsfeedTypeEnum.BOOST,
    //   created_at: new Date().toDateString(),
    //   data: {
    //     world_id: worldId,
    //     world_name: 'Odyssey World 2',
    //     world_image: 'https://picsum.photos/304',
    //     user_name: 'Booster man',
    //     amount: 49
    //   }
    // },
    // {
    //   id: `page_${page}_9___8`,
    //   author_id: 'user_6',
    //   author_name: 'Jane Doe',
    //   author_avatar: 'https://picsum.photos/204',
    //   author_world_id: worldId,
    //   author_world_name: worldName,
    //   universal,
    //   entry_type: NewsfeedTypeEnum.BOOST,
    //   created_at: new Date().toDateString(),
    //   data: {
    //     world_id: worldId,
    //     world_name: 'Odyssey World 2',
    //     world_image: 'https://picsum.photos/304',
    //     user_name: 'Booster man',
    //     amount: 49
    //   }
    // },
    // {
    //   id: `page_${page}_9___9`,
    //   author_id: 'user_6',
    //   author_name: 'Jane Doe',
    //   author_avatar: 'https://picsum.photos/204',
    //   author_world_id: worldId,
    //   author_world_name: worldName,
    //   universal,
    //   entry_type: NewsfeedTypeEnum.BOOST,
    //   created_at: new Date().toDateString(),
    //   data: {
    //     world_id: worldId,
    //     world_name: 'Odyssey World 2',
    //     world_image: 'https://picsum.photos/304',
    //     user_name: 'Booster man',
    //     amount: 49
    //   }
    // },
    // {
    //   id: `page_${page}_9___10`,
    //   author_id: 'user_6',
    //   author_name: 'Jane Doe',
    //   author_avatar: 'https://picsum.photos/204',
    //   author_world_id: worldId,
    //   author_world_name: worldName,
    //   universal,
    //   entry_type: NewsfeedTypeEnum.BOOST,
    //   created_at: new Date().toDateString(),
    //   data: {
    //     world_id: worldId,
    //     world_name: 'Odyssey World 2',
    //     world_image: 'https://picsum.photos/304',
    //     user_name: 'Booster man',
    //     amount: 49
    //   }
    // },
    // {
    //   id: `page_${page}_9___11`,
    //   author_id: 'user_6',
    //   author_name: 'Jane Doe',
    //   author_avatar: 'https://picsum.photos/204',
    //   author_world_id: worldId,
    //   author_world_name: worldName,
    //   universal,
    //   entry_type: NewsfeedTypeEnum.BOOST,
    //   created_at: new Date().toDateString(),
    //   data: {
    //     world_id: worldId,
    //     world_name: 'Odyssey World 2',
    //     world_image: 'https://picsum.photos/304',
    //     user_name: 'Booster man',
    //     amount: 49
    //   }
    // },
    // {
    //   id: `page_${page}_9___12`,
    //   author_id: 'user_6',
    //   author_name: 'Jane Doe',
    //   author_avatar: 'https://picsum.photos/204',
    //   author_world_id: worldId,
    //   author_world_name: worldName,
    //   universal,
    //   entry_type: NewsfeedTypeEnum.BOOST,
    //   created_at: new Date().toDateString(),
    //   data: {
    //     world_id: worldId,
    //     world_name: 'Odyssey World 2',
    //     world_image: 'https://picsum.photos/304',
    //     user_name: 'Booster man',
    //     amount: 49
    //   }
    // },
    // {
    //   id: `page_${page}_9___13`,
    //   author_id: 'user_6',
    //   author_name: 'Jane Doe',
    //   author_avatar: 'https://picsum.photos/204',
    //   author_world_id: worldId,
    //   author_world_name: worldName,
    //   universal,
    //   entry_type: NewsfeedTypeEnum.BOOST,
    //   created_at: new Date().toDateString(),
    //   data: {
    //     world_id: worldId,
    //     world_name: 'Odyssey World 2',
    //     world_image: 'https://picsum.photos/304',
    //     user_name: 'Booster man',
    //     amount: 49
    //   }
    // },
    // {
    //   id: `page_${page}_9___14`,
    //   author_id: 'user_6',
    //   author_name: 'Jane Doe',
    //   author_avatar: 'https://picsum.photos/204',
    //   author_world_id: worldId,
    //   author_world_name: worldName,
    //   universal,
    //   entry_type: NewsfeedTypeEnum.BOOST,
    //   created_at: new Date().toDateString(),
    //   data: {
    //     world_id: worldId,
    //     world_name: 'Odyssey World 2',
    //     world_image: 'https://picsum.photos/304',
    //     user_name: 'Booster man',
    //     amount: 49
    //   }
    // },
    // {
    //   id: `page_${page}_9___15`,
    //   author_id: 'user_6',
    //   author_name: 'Jane Doe',
    //   author_avatar: 'https://picsum.photos/204',
    //   author_world_id: worldId,
    //   author_world_name: worldName,
    //   universal,
    //   entry_type: NewsfeedTypeEnum.BOOST,
    //   created_at: new Date().toDateString(),
    //   data: {
    //     world_id: worldId,
    //     world_name: 'Odyssey World 2',
    //     world_image: 'https://picsum.photos/304',
    //     user_name: 'Booster man',
    //     amount: 49
    //   }
    // }
  ];
  return dummyEntries;
};

const NewsfeedStore = types.compose(
  ResetModel,
  types
    .model('NewsfeedStore', {
      newsfeedType: types.optional(
        types.enumeration(Object.values(NewsfeedTabTypeEnum)),
        NewsfeedTabTypeEnum.UNIVERSAL
      ),
      entries: types.optional(types.array(NewsfeedEntry), []),
      currentPage: types.optional(types.number, 0),
      itemCount: types.optional(types.number, 0)
    })
    .actions((self) => ({
      setActiveNewsfeedType(type: NewsfeedTabTypeEnum): void {
        self.newsfeedType = type;
        self.entries = cast([]);
        self.currentPage = 0;
        self.itemCount = 0;
        this.loadMore();
      },
      setEntries(entries: NewsfeedEntryInterface[], page: number, itemCount: number): void {
        self.entries = cast(entries);
        self.currentPage = page;
        self.itemCount = itemCount;
      },
      loadMore(): Promise<void> {
        // some tmp logic
        if (self.itemCount === 0) {
          self.itemCount += 10;
        }
        return new Promise((resolve) => {
          setTimeout(() => {
            const {sessionStore} = getRootStore(self);
            const {isGuest, worldsOwnedList} = sessionStore;
            const worldId = !isGuest && worldsOwnedList.length > 0 ? worldsOwnedList[0].id : null;
            const worldName =
              !isGuest && worldsOwnedList.length > 0 ? worldsOwnedList[0].name : null;

            const nextPage = self.currentPage + 1;
            const nextPageData = generateDummyItems(
              worldName,
              worldId,
              nextPage,
              self.newsfeedType === NewsfeedTabTypeEnum.UNIVERSAL
            );

            this.setEntries(
              [...self.entries, ...nextPageData],
              nextPage,
              self.itemCount + nextPageData.length
            );
            resolve();
          }, 5000);
        });
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
