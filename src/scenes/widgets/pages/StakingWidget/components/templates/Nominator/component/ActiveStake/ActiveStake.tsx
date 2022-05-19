import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {Heading, IconSvg, PropsWithThemeInterface, Text} from 'ui-kit';
import {useStore} from 'shared/hooks';

import {UnbondingIndicator} from '../UnbondingIndicator';

import * as styled from './ActiveStake.styled';

interface PropsInterface extends PropsWithThemeInterface {
  unbond: () => void;
}

const ActiveStake: FC<PropsInterface> = ({theme, unbond}) => {
  const {stakingStore} = useStore().widgetStore;
  const {stashAccountBalance, tokenSymbol} = stakingStore.polkadotProviderStore;

  return (
    <>
      <Heading type="h2" align="left" weight="bold" label={t('staking.activeStake')} />
      {Number(stashAccountBalance?.unbonding) === 0 && Number(stashAccountBalance?.bonded) === 0 ? (
        <styled.ActiveStake theme={theme}>{t('staking.noActiveStakes')}</styled.ActiveStake>
      ) : (
        <styled.ActiveStake theme={theme}>
          {stashAccountBalance?.unbonding && Number(stashAccountBalance?.unbonding) !== 0 && (
            <styled.StakeColumn>
              <UnbondingIndicator />
            </styled.StakeColumn>
          )}
          {stashAccountBalance?.bonded && Number(stashAccountBalance?.bonded) !== 0 && (
            <styled.StakeColumn>
              <Text
                text={`${t('staking.balanceTypes.staked')} ${
                  stashAccountBalance?.bonded
                } ${tokenSymbol}`}
                size="xs"
              />
            </styled.StakeColumn>
          )}
          {stashAccountBalance?.unbonding && Number(stashAccountBalance?.unbonding) === 0 && (
            <styled.DetailsColumn onClick={unbond}>
              <Text text={t('staking.unbondFunds')} size="xs" />
              <IconSvg name="arrow" size="normal" />
            </styled.DetailsColumn>
          )}
        </styled.ActiveStake>
      )}
    </>
  );
};

export default observer(ActiveStake);
