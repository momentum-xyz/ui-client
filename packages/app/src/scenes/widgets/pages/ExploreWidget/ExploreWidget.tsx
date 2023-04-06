import {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useNavigate} from 'react-router-dom';
import cn from 'classnames';
import {useI18n, i18n} from '@momentum-xyz/core';
import {TabInterface, Tabs, Panel} from '@momentum-xyz/ui-kit-storybook';

//import {ExplorePanel} from 'ui-kit';
import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';

import {WorldList, UserList} from './components';
import * as styled from './ExploreWidget.styled';

type ExploreTabType = 'worlds' | 'users';

const TABS_LIST: TabInterface<ExploreTabType>[] = [
  {id: 'worlds', icon: 'rabbit_fill', label: i18n.t('labels.odysseys')},
  {id: 'users', icon: 'astronaut', label: i18n.t('labels.accounts')}
];

const ExploreWidget: FC = () => {
  const {universeStore, widgetManagerStore} = useStore();
  const {universe2dStore} = universeStore;
  const {close} = widgetManagerStore;

  const [activeTab, setActiveTab] = useState<ExploreTabType>('worlds');
  const [activeItem, setActiveItem] = useState<{uuid: string; isWorld: boolean} | null>(null);

  const {t} = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    universe2dStore.searchQuery.resetModel();
  }, [activeTab, universe2dStore]);

  console.log(activeItem);

  return (
    <styled.Container data-testid="ExploreWidget">
      <styled.ExplorePanel className={cn(!!activeItem && 'collapsed')}>
        <Panel
          icon="search"
          variant="primary"
          title={t('labels.explore')}
          closeIcon={activeItem ? 'arrow' : 'close_large'}
          onClose={() => {
            !activeItem ? close(WidgetEnum.EXPLORE) : setActiveItem(null);
          }}
        >
          <styled.Wrapper>
            <styled.Tabs>
              <Tabs tabList={TABS_LIST} activeId={activeTab} onSelect={setActiveTab} />
            </styled.Tabs>

            <styled.Content>
              {activeTab === 'worlds' && (
                <WorldList
                  searchQuery={universe2dStore.searchQuery}
                  searchResults={universe2dStore.filteredWorlds}
                  lastCreatedItems={universe2dStore.lastCreatedWorlds}
                  mostStakedInItems={universe2dStore.mostStatedInWorlds}
                  onWorldClick={(worldId) => {
                    setActiveItem({uuid: worldId, isWorld: true});
                  }}
                  onUserClick={(userId) => {
                    setActiveItem({uuid: userId, isWorld: false});
                  }}
                  onVisit={(worldId) => {
                    navigate(generatePath(ROUTES.odyssey.base, {worldId}));
                  }}
                  onStake={(worldId) => {
                    navigate(generatePath(ROUTES.odyssey.base, {worldId}));
                  }}
                />
              )}
              {activeTab === 'users' && (
                <UserList
                  searchQuery={universe2dStore.searchQuery}
                  searchResults={universe2dStore.filteredUsers}
                  lastCreatedItems={universe2dStore.lastCreatedUsers}
                  mostStakedItems={universe2dStore.mostStatedUsers}
                  onUserClick={(userId) => {
                    setActiveItem({uuid: userId, isWorld: false});
                  }}
                  onVisit={(userId) => {
                    console.log(userId);
                  }}
                />
              )}
            </styled.Content>
          </styled.Wrapper>
        </Panel>
      </styled.ExplorePanel>

      {/* SHOW WORLD OVERVIEW */}
      {activeItem && activeItem.isWorld && <div>{activeItem.uuid}</div>}

      {/* SHOW USER OVERVIEW */}
      {activeItem && !activeItem.isWorld && <div>{activeItem.uuid}</div>}
    </styled.Container>
  );
};

export default observer(ExploreWidget);
