import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {Heading, IconSvg, PropsWithThemeInterface, Text} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {StakingTransactionType} from 'core/enums';
import {Button} from 'ui-kit';

import {UnbondingIndicator} from '../UnbondingIndicator';

import * as styled from './ActiveStake.styled';

interface PropsInterface extends PropsWithThemeInterface {
  unbond: () => void;
  withdraw: () => void;
}

const ActiveStake: FC<PropsInterface> = ({theme, withdraw, unbond}) => {
  const {stakingStore} = useStore().widgetStore;
  const {
    stashAccountBalance,
    tokenSymbol,
    isUnbondingPermitted,
    isStakingAccountUnlocking,
    isWithdrawUnbondedPermitted,
    setTransactionType
  } = stakingStore.polkadotProviderStore;

  const unbondHandler = () => isUnbondingPermitted && unbond();
  const withdrawUnbonded = () => {
    if (isWithdrawUnbondedPermitted) {
      setTransactionType(StakingTransactionType.WithdrawUnbond);
      withdraw();
    }
  };

  return (
    <>
      <Heading type="h2" align="left" weight="bold" label={t('staking.activeStake')} />
      {!isWithdrawUnbondedPermitted && !isStakingAccountUnlocking && !isUnbondingPermitted ? (
        <styled.ActiveStake theme={theme}>{t('staking.noActiveStakes')}</styled.ActiveStake>
      ) : (
        <styled.ActiveStake theme={theme}>
          {isStakingAccountUnlocking && (
            <styled.StakeColumn>
              <UnbondingIndicator />
            </styled.StakeColumn>
          )}
          {isWithdrawUnbondedPermitted && (
            <>
              <styled.StakeColumn>
                <Text
                  text={`${t('staking.balanceTypes.redeemable')} ${
                    stashAccountBalance?.redeemable
                  } ${tokenSymbol}`}
                  size="xs"
                />
              </styled.StakeColumn>
            </>
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
          <styled.StakeColumn>
            <Button
              size="small"
              label={t('staking.withdrawUnbonded')}
              disabled={!isWithdrawUnbondedPermitted}
              onClick={withdrawUnbonded}
            />
          </styled.StakeColumn>
          <styled.DetailsColumn
            onClick={unbondHandler}
            style={{opacity: isUnbondingPermitted ? 1 : 0.3}}
          >
            <Text text={t('staking.unbondFunds')} size="xs" />
            <IconSvg name="arrow" size="normal" />
          </styled.DetailsColumn>
        </styled.ActiveStake>
      )}
    </>
  );
};

export default observer(ActiveStake);
