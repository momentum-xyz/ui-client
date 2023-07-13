import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n, i18n} from '@momentum-xyz/core';
import {TabInterface, Tabs, Panel, SelectOptionInterface, PositionEnum} from '@momentum-xyz/ui-kit';

import {useNavigation, useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {StakeSortType} from 'core/types';
import {TokenSelector} from 'ui-kit';

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
  const {goToOdysseyAndStake} = useNavigation();

  const sortOptions: SelectOptionInterface<StakeSortType>[] = [
    {
      value: 'mostStaked',
      label: t('labels.mostStaked')
    }
  ];

  const stakeList = !nftStore.hasDADTokens
    ? stakingViewStore.filteredAndSortedStakeList
    : stakingViewStore.filteredAndSortedStakeList.filter(
        (stake) => stake.kind === nftStore.currentToken
      );
  console.log('[StakingViewWidget]: ', stakeList, stakeList.length);

  const onSelectWorld = (worldId: string) => {
    widgetManagerStore.open(WidgetEnum.WORLD_DETAILS, PositionEnum.LEFT, {id: worldId});
  };

  const onStakeWorld = (worldId: string) => {
    goToOdysseyAndStake(worldId);
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
                stakeList={stakeList}
                mostStakedWorlds={universe2dStore.mostStakedWorlds}
                isStakeListEmpty={nftStore.stakes.length === 0}
                filterField={stakingViewStore.filterField}
                filterOptions={nftStore.walletOptions}
                moreFilters={
                  nftStore.hasDADTokens && (
                    <styled.TokenSelector>
                      <div>{t('labels.token')}</div>
                      <TokenSelector />
                    </styled.TokenSelector>
                  )
                }
                sortField={stakingViewStore.sortField}
                sortOptions={sortOptions}
                onReloadStakes={nftStore.loadMyStakes}
                onSelectWorld={onSelectWorld}
                onStake={onStakeWorld}
              />
            )}

            {activeTab === 'wallet' && (
              <MyWallet
                walletOptions={nftStore.walletOptions}
                selectedWallet={nftStore.selectedWallet}
                selectedWalletTransferrable={nftStore.balanceTransferrable}
                selectedWalletStaked={nftStore.balanceStaked}
                tokenSymbol={nftStore.tokenSymbol}
                showTokenSelector={nftStore.hasDADTokens}
                onSelectWallet={nftStore.setSelectedWalletId}
              />
            )}
          </styled.Content>
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(StakingViewWidget);
