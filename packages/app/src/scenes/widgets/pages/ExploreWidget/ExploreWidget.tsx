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

import {WorldList, UserList, WorldDetails, UserDetails} from './components';
import * as styled from './ExploreWidget.styled';

type ExploreTabType = 'worlds' | 'users';

const TABS_LIST: TabInterface<ExploreTabType>[] = [
  {id: 'worlds', icon: 'rabbit_fill', label: i18n.t('labels.odysseys')},
  {id: 'users', icon: 'astronaut', label: i18n.t('labels.members')}
];

const ExploreWidget: FC = () => {
  const {universeStore, widgetManagerStore} = useStore();
  const {universe2dStore} = universeStore;
  const {hasSelectedUnit} = universe2dStore;
  const {close} = widgetManagerStore;

  const [activeTab, setActiveTab] = useState<ExploreTabType>('worlds');

  const {t} = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    universe2dStore.searchQuery.resetModel();
  }, [activeTab, universe2dStore]);

  useEffect(() => {
    return () => {
      universe2dStore.resetUnits();
    };
  }, [universe2dStore]);

  return (
    <styled.Container data-testid="ExploreWidget">
      <styled.ExplorePanel className={cn(hasSelectedUnit && 'collapsed')}>
        <Panel
          icon="explore"
          variant="primary"
          title={t('labels.explore')}
          closeIcon={hasSelectedUnit ? 'arrow' : 'close_large'}
          onClose={() => {
            hasSelectedUnit ? universe2dStore.resetUnits() : close(WidgetEnum.EXPLORE);
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
                    universe2dStore.selectWorld(worldId);
                  }}
                  onUserClick={(userId) => {
                    universe2dStore.selectUser(userId);
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
                    universe2dStore.selectUser(userId);
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
      {universe2dStore.selectedWorld && (
        <styled.Details>
          <WorldDetails
            worldId={universe2dStore.selectedWorld}
            onClose={universe2dStore.resetUnits}
          />
        </styled.Details>
      )}

      {/* SHOW USER OVERVIEW */}
      {universe2dStore.selectedUser && (
        <styled.Details>
          <UserDetails userId={universe2dStore.selectedUser} onClose={universe2dStore.resetUnits} />
        </styled.Details>
      )}
    </styled.Container>
  );
};

export default observer(ExploreWidget);
