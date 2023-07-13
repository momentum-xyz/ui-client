import {FC} from 'react';
import {useI18n} from '@momentum-xyz/core';

import {ButtonEllipse, Image} from '../../atoms';

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
      <Image src={worldImageUrl} errorIcon="rabbit_fill" isIconAccent onClick={onInfoClick} />
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
          <ButtonEllipse icon="info_2" variant="secondary" onClick={onInfoClick} />
          {!!onUnstakeClick && (
            <ButtonEllipse
              variant="secondary"
              label={t('actions.unstake')}
              icon="unstake"
              onClick={onUnstakeClick}
            />
          )}
          <ButtonEllipse
            variant="secondary"
            label={t('actions.addStake')}
            icon="stake"
            onClick={onStakeClick}
          />
        </styled.Actions>
      </styled.Content>
    </styled.Wrapper>
  );
};

export default StakeCard;
