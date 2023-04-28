import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useNavigate} from 'react-router-dom';
import {useI18n, i18n} from '@momentum-xyz/core';
import {
  TabInterface,
  Tabs,
  Panel,
  SelectOptionInterface,
  PositionEnum
} from '@momentum-xyz/ui-kit-storybook';

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
  const {widgetManagerStore, widgetStore, nftStore, universeStore} = useStore();
  const {universe2dStore} = universeStore;
  const {stakingViewStore} = widgetStore;
  const {close} = widgetManagerStore;

  const [activeTab, setActiveTab] = useState<StakingTabType>('stakes');

  const {t} = useI18n();
  const navigate = useNavigate();

  const walletOptions: SelectOptionInterface<string>[] = nftStore.wallets.map((wallet) => ({
    value: wallet.wallet_id,
    label: wallet.wallet_id,
    icon: 'talisman'
  }));

  const sortOptions: SelectOptionInterface<StakeSortType>[] = [
    {
      value: 'mostStaked',
      label: t('labels.mostStaked')
    }
  ];

  const onSelectWorld = (worldId: string) => {
    widgetManagerStore.open(WidgetEnum.WORLD_DETAILS, PositionEnum.LEFT, {id: worldId});
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
        isFullHeight
        size="large"
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
                mostStakedWorlds={universe2dStore.mostStakedWorlds}
                isStakeListEmpty={nftStore.stakes.length === 0}
                filterField={stakingViewStore.filterField}
                filterOptions={walletOptions}
                sortField={stakingViewStore.sortField}
                sortOptions={sortOptions}
                onSelectWorld={onSelectWorld}
                onUnstake={onUnstake}
                onStake={onStake}
              />
            )}

            {activeTab === 'wallet' && (
              <MyWallet wallets={nftStore.wallets} walletOptions={walletOptions} />
            )}
          </styled.Content>
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(StakingViewWidget);
