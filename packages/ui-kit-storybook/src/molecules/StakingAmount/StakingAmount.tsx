import {FC, memo} from 'react';
import {NumericFormat, NumericFormatProps} from 'react-number-format';
import {useI18n} from '@momentum-xyz/core';

import {ButtonEllipse} from '../../atoms';

import * as styled from './StakingAmount.styled';

export interface StakingAmountPropsInterface {
  username: string;
  amount: number;
  rewardsAmount: number;
  tokenSymbol: string;
  onUnstakeClick?: () => void;
}

const FORMATTING: NumericFormatProps = {
  displayType: 'text',
  decimalSeparator: '.',
  thousandSeparator: ' ',
  decimalScale: 3
};

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
          <styled.ItemValue>
            <NumericFormat {...FORMATTING} value={amount} />
            <styled.ItemSuffix>{tokenSymbol}</styled.ItemSuffix>
          </styled.ItemValue>
        </styled.Item>
        <styled.Item>
          <styled.ItemLabel>{t('staking.rewards')}:</styled.ItemLabel>
          <styled.ItemValue>
            <NumericFormat {...FORMATTING} value={rewardsAmount} />
            <styled.ItemSuffix>{tokenSymbol}</styled.ItemSuffix>
          </styled.ItemValue>
        </styled.Item>
      </styled.Content>
    </styled.Container>
  );
};

export default memo(StakingAmount);
