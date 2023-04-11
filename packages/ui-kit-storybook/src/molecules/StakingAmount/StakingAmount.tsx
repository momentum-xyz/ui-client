import {FC, memo} from 'react';
import {useI18n} from '@momentum-xyz/core';

import {ButtonEllipse, SymbolAmount} from '../../atoms';

import * as styled from './StakingAmount.styled';

export interface StakingAmountPropsInterface {
  username: string;
  amount: number;
  rewardsAmount: number;
  tokenSymbol: string;
  onUnstakeClick?: () => void;
}

const StakingAmount: FC<StakingAmountPropsInterface> = ({
  username,
  amount,
  rewardsAmount,
  tokenSymbol,
  onUnstakeClick
}) => {
  const {t} = useI18n();

  return (
    <styled.Container data-testid="StakingAmount-test">
      <styled.Header>
        <styled.NameContainer>
          <styled.Name>{username}</styled.Name>
        </styled.NameContainer>
        <ButtonEllipse icon="close_large" label={t('staking.unStake')} onClick={onUnstakeClick} />
      </styled.Header>

      <styled.Content>
        <styled.Item>
          <styled.ItemLabel>{t('staking.balanceTypes.staked')}:</styled.ItemLabel>
          <SymbolAmount value={amount} tokenSymbol={tokenSymbol} />
        </styled.Item>
        <styled.Item>
          <styled.ItemLabel>{t('staking.rewards')}:</styled.ItemLabel>
          <SymbolAmount value={rewardsAmount} tokenSymbol={tokenSymbol} />
        </styled.Item>
      </styled.Content>
    </styled.Container>
  );
};

export default memo(StakingAmount);
