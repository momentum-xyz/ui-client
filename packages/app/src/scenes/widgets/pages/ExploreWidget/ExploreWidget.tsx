import {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';
import {useI18n, i18n} from '@momentum-xyz/core';
import {TabInterface, Tabs, Panel} from '@momentum-xyz/ui-kit';

import {useNavigation, useStore} from 'shared/hooks';
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
  const {goToOdysseyHome, goToOdysseyAndStake} = useNavigation();

  useEffect(() => {
    universe2dStore.searchQuery.resetModel();
  }, [activeTab, universe2dStore]);

  useEffect(() => {
    return () => {
      universe2dStore.resetUnits();
    };
  }, [universe2dStore]);

  const onSelectUser = (userId: string) => {
    universe2dStore.selectUser(userId);
  };

  const onSelectWorld = (worldId: string) => {
    universe2dStore.selectWorld(worldId);
  };

  const onVisitWorld = (worldId: string) => {
    goToOdysseyHome(worldId);
  };

  const onStakeWorld = (worldId: string) => {
    goToOdysseyAndStake(worldId);
  };

  return (
    <styled.Container data-testid="ExploreWidget-test">
      <styled.ExplorePanel className={cn(hasSelectedUnit && 'collapsed')}>
        <Panel
          isFullHeight
          size="large"
          icon="explore"
          variant="primary"
          title={t('labels.explore')}
          closeIcon={hasSelectedUnit ? 'arrow' : 'close_large'}
          onClose={() => {
            hasSelectedUnit ? universe2dStore.resetUnits() : close(WidgetEnum.EXPLORE);
          }}
        >
          <styled.Wrapper className={cn(hasSelectedUnit && 'collapsed')}>
            <styled.Tabs>
              <Tabs tabList={TABS_LIST} activeId={activeTab} onSelect={setActiveTab} />
            </styled.Tabs>

            <styled.Content>
              {activeTab === 'worlds' && (
                <WorldList
                  searchQuery={universe2dStore.searchQuery}
                  searchResults={universe2dStore.filteredWorlds}
                  lastCreatedWorlds={universe2dStore.lastCreatedSliderWorlds}
                  mostStakedWorlds={universe2dStore.mostStakedSliderWorlds}
                  onSelectWorld={onSelectWorld}
                  onSelectUser={onSelectUser}
                  onVisitWorld={onVisitWorld}
                  onStakeWorld={onStakeWorld}
                />
              )}

              {activeTab === 'users' && (
                <UserList
                  searchQuery={universe2dStore.searchQuery}
                  searchResults={universe2dStore.filteredUsers}
                  lastCreatedUsers={universe2dStore.lastCreatedSliderUsers}
                  mostStakedUsers={universe2dStore.mostStakedUsers}
                  onSelectUser={onSelectUser}
                />
              )}
            </styled.Content>
          </styled.Wrapper>
        </Panel>
      </styled.ExplorePanel>

      {/* SHOW WORLD OVERVIEW */}
      {universe2dStore.selectedWorld?.world && (
        <styled.Details>
          <WorldDetails
            world={universe2dStore.selectedWorld.world}
            onSelectUser={onSelectUser}
            onVisitWorld={onVisitWorld}
            onStakeWorld={onStakeWorld}
            onClose={universe2dStore.resetUnits}
          />
        </styled.Details>
      )}

      {/* SHOW USER OVERVIEW */}
      {universe2dStore.selectedUser && (
        <styled.Details>
          <UserDetails
            userDetails={universe2dStore.selectedUser}
            onVisitWorld={onVisitWorld}
            onSelectWorld={onSelectWorld}
            onClose={universe2dStore.resetUnits}
          />
        </styled.Details>
      )}
    </styled.Container>
  );
};

export default observer(ExploreWidget);
