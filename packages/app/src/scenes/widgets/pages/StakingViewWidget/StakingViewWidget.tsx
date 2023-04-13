import {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useNavigate} from 'react-router-dom';
import {useI18n, i18n} from '@momentum-xyz/core';
import {TabInterface, Tabs, Panel, SelectOptionInterface} from '@momentum-xyz/ui-kit-storybook';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {StakeSortType} from 'core/types';

import {StakeList, MyWallet} from './components';
import * as styled from './StakingViewWidget.styled';

type StakingTabType = 'stakes' | 'wallet';

const TABS_LIST: TabInterface<StakingTabType>[] = [
  {id: 'stakes', icon: 'stake', label: i18n.t('labels.activeStakes')},
  {id: 'wallet', icon: 'status-2', label: i18n.t('labels.overview')}
];

const StakingViewWidget: FC = () => {
  const {widgetManagerStore, widgetStore} = useStore();
  const {stakingViewStore} = widgetStore;
  const {close} = widgetManagerStore;

  const [activeTab, setActiveTab] = useState<StakingTabType>('stakes');

  const {t} = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    stakingViewStore.init();

    return () => {
      stakingViewStore.resetModel();
    };
  }, [stakingViewStore]);

  const walletOptions: SelectOptionInterface<string>[] = stakingViewStore.wallets.map((wallet) => ({
    value: wallet.hash,
    label: wallet.hash
  }));

  const sortOptions: SelectOptionInterface<StakeSortType>[] = [
    {
      value: 'mostStaked',
      label: t('labels.mostStaked')
    }
  ];

  const onSelectStake = (uuid: string) => {
    console.log(uuid);
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
                stakeList={stakingViewStore.filteredAndSortedStakeList}
                filterField={stakingViewStore.filterField}
                filterOptions={walletOptions}
                sortField={stakingViewStore.sortField}
                sortOptions={sortOptions}
                onSelectStake={onSelectStake}
                onUnstake={onUnstake}
                onStake={onStake}
              />
            )}

            {activeTab === 'wallet' && (
              <MyWallet wallets={stakingViewStore.wallets} walletOptions={walletOptions} />
            )}
          </styled.Content>
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(StakingViewWidget);