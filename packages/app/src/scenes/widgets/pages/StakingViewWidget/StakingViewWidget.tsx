import {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useNavigate} from 'react-router-dom';
import {useI18n, i18n} from '@momentum-xyz/core';
import {TabInterface, Tabs, Panel} from '@momentum-xyz/ui-kit-storybook';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {StakingViewStore} from 'scenes/widgets/stores';

import {StakeList} from './components';
import * as styled from './StakingViewWidget.styled';

type StakingTabType = 'stakes' | 'details';

const TABS_LIST: TabInterface<StakingTabType>[] = [
  {id: 'stakes', icon: 'stake', label: i18n.t('labels.activeStakes')},
  {id: 'details', icon: 'status-2', label: i18n.t('labels.overview')}
];

const StakingViewWidget: FC = () => {
  const stakingViewStore = StakingViewStore.create();
  const {widgetManagerStore} = useStore();
  const {close} = widgetManagerStore;

  const [activeTab, setActiveTab] = useState<StakingTabType>('stakes');
  const [activeStakeId, setActiveStakeId] = useState<string | null>(null);

  const {t} = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    stakingViewStore.init();
  }, [stakingViewStore]);

  const onSelectStake = (uuid: string) => {
    setActiveStakeId(uuid);
  };

  const onUnstake = (uuid: string) => {
    console.log(uuid);
  };

  const onStake = (worldId: string) => {
    navigate(generatePath(ROUTES.odyssey.base, {worldId}));
  };

  return (
    <styled.Container data-testid="StakingViewWidget-test">
      <Panel
        icon="status-2"
        variant="primary"
        title={t('labels.stakingOverview')}
        onClose={() => close(WidgetEnum.STAKING_VIEW)}
      >
        <styled.Wrapper>
          <styled.Tabs>
            <Tabs tabList={TABS_LIST} activeId={activeTab} onSelect={setActiveTab} />
          </styled.Tabs>

          <styled.Content>
            {activeTab === 'stakes' && (
              <StakeList
                searchQuery={stakingViewStore.searchQuery}
                stakeList={stakingViewStore.stakeList}
                onSelectStake={onSelectStake}
                onUnstake={onUnstake}
                onStake={onStake}
              />
            )}

            {activeTab === 'details' && <>{activeStakeId}</>}
          </styled.Content>
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(StakingViewWidget);
