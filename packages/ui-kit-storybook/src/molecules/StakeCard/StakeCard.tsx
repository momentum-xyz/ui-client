import {FC} from 'react';
import {NumericFormat, NumericFormatProps} from 'react-number-format';
import {useI18n} from '@momentum-xyz/core';

import {ButtonEllipse, ButtonRound, Image} from '../../atoms';

import * as styled from './StakeCard.styled';

export interface StakeCardPropsInterface {
  nftName: string;
  nftImageUrl?: string | null;
  stakedAmount: number;
  rewardAmount: number;
  tokenSymbol: string;
  onInfoClick: () => void;
  onStakeClick: () => void;
  onUnstakeClick: () => void;
}

const FORMATTING: NumericFormatProps = {
  displayType: 'text',
  decimalSeparator: '.',
  thousandSeparator: ' ',
  decimalScale: 2
};

const StakeCard: FC<StakeCardPropsInterface> = ({
  nftName,
  nftImageUrl,
  stakedAmount,
  rewardAmount,
  tokenSymbol,
  onInfoClick,
  onUnstakeClick,
  onStakeClick
}) => {
  const {t} = useI18n();

  return (
    <styled.Wrapper data-testid="StakeCard-test">
      <Image src={nftImageUrl} errorIcon="astronaut" onClick={onInfoClick} />
      <styled.Content>
        <styled.Name>{nftName}</styled.Name>

        <styled.Totals>
          <styled.TotalLine>
            <span>{t('labels.staked')}</span>
            <styled.TokensAmount>
              <NumericFormat {...FORMATTING} value={stakedAmount} /> {tokenSymbol}
            </styled.TokensAmount>
          </styled.TotalLine>

          <styled.TotalLine>
            <span>{t('labels.reward')}</span>
            <styled.TokensAmount>
              <NumericFormat {...FORMATTING} value={rewardAmount} /> {tokenSymbol}
            </styled.TokensAmount>
          </styled.TotalLine>
        </styled.Totals>

        <styled.Actions>
          <ButtonRound icon="info_2" onClick={onInfoClick} />
          <ButtonEllipse label={t('actions.unstake')} icon="fly-to" onClick={onUnstakeClick} />
          <ButtonEllipse label={t('actions.addStake')} icon="stake" onClick={onStakeClick} />
        </styled.Actions>
      </styled.Content>
    </styled.Wrapper>
  );
};

export default StakeCard;
