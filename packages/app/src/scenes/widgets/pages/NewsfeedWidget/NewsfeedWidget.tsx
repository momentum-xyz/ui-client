import {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n, i18n, NewsfeedTypeEnum} from '@momentum-xyz/core';
import {
  TabInterface,
  Tabs,
  Panel,
  NewsfeedEntry,
  NewsfeedEntryInterface
} from '@momentum-xyz/ui-kit';

import {useNavigation, useStore} from 'shared/hooks';
import {NewsfeedTabTypeEnum, WidgetEnum} from 'core/enums';

import * as styled from './NewsfeedWidget.styled';

const TABS_LIST: TabInterface<NewsfeedTabTypeEnum>[] = [
  {id: NewsfeedTabTypeEnum.UNIVERSAL, icon: 'clock', label: i18n.t('labels.universal')},
  {id: NewsfeedTabTypeEnum.MY_CONNECTIONS, icon: 'connect', label: i18n.t('labels.myConnections')}
];

const NewsfeedWidget: FC = () => {
  const {widgetManagerStore, widgetStore, sessionStore} = useStore();
  const {isGuest, worldsOwnedList} = sessionStore;
  const {close} = widgetManagerStore;
  const {newsfeedStore} = widgetStore;
  const {newsfeedType, entries, currentTabEntries, setActiveNewsfeedType, setEntries} =
    newsfeedStore;

  const {t} = useI18n();

  const {goToOdysseyHome} = useNavigation();

  useEffect(() => {
    if (entries.length || !sessionStore.user) {
      return;
    }

    const worldId = !isGuest && worldsOwnedList.length > 0 ? worldsOwnedList[0].id : null;
    const dummyEntries: NewsfeedEntryInterface[] = [
      {
        id: '1',
        author_id: 'user_1',
        author_name: 'John Doe',
        author_avatar: 'https://picsum.photos/201',
        universal: true,
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
        id: '2',
        author_id: 'user_2',
        author_name: 'John Doe',
        author_avatar: 'https://picsum.photos/202',
        universal: true,
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
        id: '3',
        author_id: 'user_3',
        author_name: 'Jane Doe',
        author_avatar: 'https://picsum.photos/203',
        universal: true,
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
        id: '4',
        author_id: 'user_4',
        author_name: 'John Doe',
        author_avatar: 'https://picsum.photos/204',
        universal: true,
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
        id: '5',
        author_id: 'user_5',
        author_name: 'John Doe',
        author_avatar: 'https://picsum.photos/203',
        universal: false,
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
        id: '6',
        author_id: 'user_6',
        author_name: 'Jane Doe',
        author_avatar: 'https://picsum.photos/204',
        universal: false,
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
    ];

    setEntries(dummyEntries);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStore.user]);

  const handleWorldOpen = useCallback(
    (entry: NewsfeedEntryInterface) => {
      console.log('Open newsfeed entry world', entry);
      if (!entry.data.world_id) {
        return;
      }
      goToOdysseyHome(entry.data.world_id);
    },
    [goToOdysseyHome]
  );

  return (
    <styled.Container data-testid="NewsfeedWidget-test">
      <Panel
        isFullHeight
        size="normal"
        icon="newsfeed"
        variant="primary"
        title={t('labels.newsfeed')}
        onClose={() => close(WidgetEnum.NEWSFEED)}
      >
        <styled.Wrapper>
          <styled.Tabs>
            <Tabs tabList={TABS_LIST} activeId={newsfeedType} onSelect={setActiveNewsfeedType} />
          </styled.Tabs>
          <styled.Content>
            {currentTabEntries.map((entry) => (
              <NewsfeedEntry
                key={entry.id}
                entry={entry}
                onWorldOpen={handleWorldOpen}
                onShare={() => {}}
              />
            ))}
          </styled.Content>
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(NewsfeedWidget);
