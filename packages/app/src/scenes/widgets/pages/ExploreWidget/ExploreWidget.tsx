import {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useNavigate} from 'react-router-dom';
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

  const {t} = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    universe2dStore.searchQuery.resetModel();
  }, [activeTab, universe2dStore]);

  return (
    <styled.Container data-testid="ExploreWidget">
      <Panel
        icon="search"
        variant="primary"
        title={t('labels.explore')}
        onClose={() => close(WidgetEnum.EXPLORE)}
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
                onShowDetails={(uuid) => {
                  console.log(uuid);
                }}
                onVisit={(worldId) => {
                  navigate(generatePath(ROUTES.odyssey.base, {worldId}));
                }}
                onStake={(worldId) => {
                  navigate(generatePath(ROUTES.odyssey.base, {worldId}));
                }}
              />
            )}
            {activeTab === 'users' && <UserList />}
          </styled.Content>
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(ExploreWidget);
