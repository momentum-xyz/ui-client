import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n, i18n} from '@momentum-xyz/core';
import {TabInterface, Tabs, Panel} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {NewsfeedTabTypeEnum, NewsfeedTypeEnum, WidgetEnum} from 'core/enums';
import {NewsfeedEntryModelInterface} from 'core/models';

import * as styled from './NewsfeedWidget.styled';
import {NewsfeedEntry} from './components';

const TABS_LIST: TabInterface<NewsfeedTabTypeEnum>[] = [
  {id: NewsfeedTabTypeEnum.UNIVERSAL, icon: 'clock', label: i18n.t('labels.universal')},
  {id: NewsfeedTabTypeEnum.MY_CONNECTIONS, icon: 'connect', label: i18n.t('labels.myConnections')}
];

const NewsfeedWidget: FC = () => {
  const {widgetManagerStore, widgetStore, sessionStore} = useStore();
  const {close} = widgetManagerStore;
  const {newsfeedStore} = widgetStore;
  const {newsfeedType, entries, currentTabEntries, setActiveNewsfeedType, setEntries} =
    newsfeedStore;

  const {t} = useI18n();

  useEffect(() => {
    if (entries.length || !sessionStore.user) {
      return;
    }
    const {user, worldsOwnedList, userImageUrl} = sessionStore;
    const dummyEntries: NewsfeedEntryModelInterface[] = [
      {
        id: '1',
        author_id: user.id,
        author_name: user.name,
        author_avatar: userImageUrl,
        universal: true,
        entry_type: NewsfeedTypeEnum.CREATED,
        created_at: new Date().toDateString(),
        data: {
          world_id: worldsOwnedList[0].id,
          world_name: 'Odyssey World 1',
          world_image: 'https://picsum.photos/301',
          user_name: user.name,
          amount: null
        }
      },
      {
        id: '2',
        author_id: user.id,
        author_name: user.name,
        author_avatar: userImageUrl,
        universal: true,
        entry_type: NewsfeedTypeEnum.BOOST,
        created_at: new Date().toDateString(),
        data: {
          world_id: worldsOwnedList[0].id,
          world_name: 'Odyssey World 1',
          world_image: 'https://picsum.photos/302',
          user_name: 'Booster man',
          amount: 100
        }
      },
      {
        id: '3',
        author_id: user.id,
        author_name: user.name,
        author_avatar: userImageUrl,
        universal: true,
        entry_type: NewsfeedTypeEnum.CREATED,
        created_at: new Date().toDateString(),
        data: {
          world_id: worldsOwnedList[0].id,
          world_name: 'Odyssey World 2',
          world_image: 'https://picsum.photos/303',
          user_name: user.name,
          amount: null
        }
      },
      {
        id: '4',
        author_id: user.id,
        author_name: user.name,
        author_avatar: userImageUrl,
        universal: true,
        entry_type: NewsfeedTypeEnum.BOOST,
        created_at: new Date().toDateString(),
        data: {
          world_id: worldsOwnedList[0].id,
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

  const handleWorldOpen = (entry: NewsfeedEntryModelInterface) => {
    console.log(entry);
  };

  return (
    <styled.Container data-testid="NewsfeedWidget-test">
      <Panel
        isFullHeight
        size="large"
        icon="no_fire"
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
              <NewsfeedEntry key={entry.id} entry={entry} onWorldOpen={handleWorldOpen} />
            ))}
          </styled.Content>
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(NewsfeedWidget);