import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n, i18n} from '@momentum-xyz/core';
import {TabInterface, Tabs, Panel, Frame} from '@momentum-xyz/ui-kit-storybook';

//import {ExplorePanel} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';

import {WorldList, UserList} from './components';
import * as styled from './ExploreWidget.styled';

type ExploreTabType = 'worlds' | 'users';

const TABS_LIST: TabInterface<ExploreTabType>[] = [
  {id: 'worlds', icon: 'rabbit', label: i18n.t('labels.odysseys')},
  {id: 'users', icon: 'astronaut', label: i18n.t('labels.accounts')}
];

const ExploreWidget: FC = () => {
  const {universeStore, widgetManagerStore} = useStore();
  const {universe2dStore} = universeStore;
  const {close} = widgetManagerStore;

  const [activeTab, setActiveTab] = useState<ExploreTabType>('worlds');

  const {t} = useI18n();

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
            <Frame>
              {activeTab === 'worlds' && (
                <WorldList
                  lastCreatedItems={universe2dStore.getLastCreatedWorlds()}
                  lastUpdatedItems={universe2dStore.getLastUpdatedWorlds()}
                  mostFeaturedItems={universe2dStore.getMostFeaturedWorlds()}
                  mostStakedInItems={universe2dStore.getMostStatedInWorlds()}
                />
              )}
              {activeTab === 'users' && <UserList />}
            </Frame>
          </styled.Content>
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(ExploreWidget);
