import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n, i18n} from '@momentum-xyz/core';
import {TabInterface, Tabs, Panel, Frame} from '@momentum-xyz/ui-kit-storybook';

//import {ExplorePanel} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';

import * as styled from './ExploreWidget.styled';

type ExploreTabType = 'odysseys' | 'accounts';

const TABS_LIST: TabInterface<ExploreTabType>[] = [
  {id: 'odysseys', icon: 'rabbit', label: i18n.t('labels.odysseys')},
  {id: 'accounts', icon: 'astronaut', label: i18n.t('labels.accounts')}
];

const ExploreWidget: FC = () => {
  const {widgetManagerStore} = useStore();
  const {close} = widgetManagerStore;

  const [activeTab, setActiveTab] = useState<ExploreTabType>('odysseys');

  //const exploreStore = ExploreStore.create();
  //const navigate = useNavigate();

  const {t} = useI18n();

  return (
    <Panel
      icon="search"
      variant="primary"
      title={t('labels.explore')}
      onClose={() => close(WidgetEnum.EXPLORE)}
    >
      <styled.Container data-testid="ExploreWidget">
        <styled.Tabs>
          <Tabs tabList={TABS_LIST} activeId={activeTab} onSelect={setActiveTab} />
        </styled.Tabs>

        <styled.Content>
          <Frame>
            {activeTab === 'odysseys' && <div>odysseys</div>}
            {activeTab === 'accounts' && <div>accounts</div>}
          </Frame>
        </styled.Content>
      </styled.Container>
    </Panel>
  );
};

export default observer(ExploreWidget);
