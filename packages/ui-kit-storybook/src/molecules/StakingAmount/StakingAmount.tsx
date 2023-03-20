import {FC, memo} from 'react';
import {NumericFormat, NumericFormatProps} from 'react-number-format';

import {ButtonEllipse} from '../../atoms';

import * as styled from './StakingAmount.styled';

// FIXME: Translations
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
  return (
    <styled.Container data-testid="StakingAmount-test">
      <styled.Header>
        <styled.NameContainer>
          <styled.Name>{username}</styled.Name>
        </styled.NameContainer>
        <ButtonEllipse icon="close_large" label="Unstake" onClick={onUnstakeClick} />
      </styled.Header>

      <styled.Content>
        <styled.Item>
          <styled.ItemLabel>Staked:</styled.ItemLabel>
          <styled.ItemValue>
            <NumericFormat {...FORMATTING} value={amount} />
            <styled.ItemSuffix>{tokenSymbol}</styled.ItemSuffix>
          </styled.ItemValue>
        </styled.Item>
        <styled.Item>
          <styled.ItemLabel>Rewards:</styled.ItemLabel>
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
