import React from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {useStore} from 'shared/hooks';

import {BalanceItem} from '../BalanceItem';

import * as styled from './BalanceList.styled';

const BalanceList = () => {
  const {widgetStore} = useStore();
  const {stashStakingBalance, tokenSymbol} = widgetStore.stakingStore.polkadotProviderStore;

  const Balance = [
    {
      label: t('staking.balanceTypes.account'),
      value: `${stashStakingBalance.total} ${tokenSymbol}`
    },
    {
      label: t('staking.balanceTypes.transferable'),
      value: `${stashStakingBalance.transferable} ${tokenSymbol}`
    },
    {
      label: t('staking.balanceTypes.staked'),
      value: `${stashStakingBalance.bonded} ${tokenSymbol}`
    },
    {
      label: t('staking.balanceTypes.unbonding'),
      value: `${stashStakingBalance.unbonding} ${tokenSymbol}`
    }
  ];

  return (
    <styled.BalanceList>
      {Balance.map((balanceType, index) => (
        <BalanceItem key={index} {...balanceType} />
      ))}
    </styled.BalanceList>
  );
};

export default observer(BalanceList);
