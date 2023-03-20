import {FC, memo} from 'react';
import {NumericFormat, NumericFormatProps} from 'react-number-format';

import {ButtonEllipse} from '../../atoms';

import * as styled from './StakingAmount.styled';

// FIXME: Translations
export interface StakingAmountPropsInterface {
  username: string;
  amount: number;
  rewardsAmount: number;
  onUnstakeClick?: () => void;
}

const StakingAmount: FC<StakingAmountPropsInterface> = ({
  username,
  amount,
  rewardsAmount,
  onUnstakeClick
}) => {
  const formatting: NumericFormatProps = {
    displayType: 'text',
    decimalSeparator: '.',
    thousandSeparator: ' ',
    decimalScale: 3
  };

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
            <NumericFormat {...formatting} value={amount} />
            <styled.ItemSuffix>MOM</styled.ItemSuffix>
          </styled.ItemValue>
        </styled.Item>
        <styled.Item>
          <styled.ItemLabel>Rewards:</styled.ItemLabel>
          <styled.ItemValue>
            <NumericFormat {...formatting} value={rewardsAmount} />
            <styled.ItemSuffix>MOM</styled.ItemSuffix>
          </styled.ItemValue>
        </styled.Item>
      </styled.Content>
    </styled.Container>
  );
};

export default memo(StakingAmount);
