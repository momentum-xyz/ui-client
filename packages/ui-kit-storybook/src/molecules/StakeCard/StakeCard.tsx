import {FC} from 'react';
import {useI18n} from '@momentum-xyz/core';

import {ButtonEllipse, ButtonRound, Image} from '../../atoms';

import * as styled from './StakeCard.styled';

export interface StakeCardPropsInterface {
  worldName: string;
  worldImageUrl: string | null;
  staked: string;
  reward?: string;
  tokenSymbol: string;
  onInfoClick: () => void;
  onStakeClick: () => void;
  onUnstakeClick?: () => void;
}

const StakeCard: FC<StakeCardPropsInterface> = ({
  worldName,
  worldImageUrl,
  staked,
  reward,
  tokenSymbol,
  onInfoClick,
  onUnstakeClick,
  onStakeClick
}) => {
  const {t} = useI18n();

  return (
    <styled.Wrapper data-testid="StakeCard-test">
      <Image src={worldImageUrl} errorIcon="astronaut" onClick={onInfoClick} />
      <styled.Content>
        <styled.Name>{worldName}</styled.Name>

        <styled.Totals>
          <styled.TotalLine>
            <span>{t('labels.staked')}</span>
            <styled.TokensAmount>
              <span>{staked}</span> {tokenSymbol}
            </styled.TokensAmount>
          </styled.TotalLine>

          {reward && (
            <styled.TotalLine>
              <span>{t('labels.reward')}</span>
              <styled.TokensAmount>
                <span>{reward}</span> {tokenSymbol}
              </styled.TokensAmount>
            </styled.TotalLine>
          )}
        </styled.Totals>

        <styled.Actions>
          <ButtonRound icon="info_2" onClick={onInfoClick} />
          {!!onUnstakeClick && (
            <ButtonEllipse label={t('actions.unstake')} icon="fly-to" onClick={onUnstakeClick} />
          )}
          <ButtonEllipse label={t('actions.addStake')} icon="stake" onClick={onStakeClick} />
        </styled.Actions>
      </styled.Content>
    </styled.Wrapper>
  );
};

export default StakeCard;
