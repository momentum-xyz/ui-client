import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {Heading, IconSvg, PropsWithThemeInterface, Text, Button} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {StakingTransactionType} from 'core/enums';

import {UnbondingIndicator} from '../index';

import * as styled from './ActiveStake.styled';

interface PropsInterface extends PropsWithThemeInterface {
  goToUnbond: () => void;
  goToAuthorization: () => void;
}

const ActiveStake: FC<PropsInterface> = ({theme, goToAuthorization, goToUnbond}) => {
  const {stakingStore} = useStore().widgetStore;
  const {
    stashStakingBalance,
    tokenSymbol,
    isUnbondingPermitted,
    isStakingAccountUnlocking,
    isWithdrawUnbondedPermitted,
    setTransactionType,
    stakingInfo
  } = stakingStore.polkadotProviderStore;

  const unbondHandler = () => isUnbondingPermitted && goToUnbond();
  const withdrawUnbonded = () => {
    if (isWithdrawUnbondedPermitted) {
      setTransactionType(StakingTransactionType.WithdrawUnbond);
      goToAuthorization();
    }
  };
  const stopStaking = () => {
    if (!isStakingAccountUnlocking) {
      setTransactionType(StakingTransactionType.Chill);
      goToAuthorization();
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
                    stashStakingBalance.redeemable
                  } ${tokenSymbol}`}
                  size="xs"
                />
              </styled.StakeColumn>
            </>
          )}
          {stashStakingBalance.bonded && Number(stashStakingBalance.bonded) !== 0 && (
            <styled.StakeColumn>
              <Text
                text={`${t('staking.balanceTypes.staked')} ${
                  stashStakingBalance.bonded
                } ${tokenSymbol}`}
                size="xs"
              />
            </styled.StakeColumn>
          )}
          <styled.WithdrawColumn>
            <Button
              variant="primary"
              icon="lock"
              wide={false}
              label={t('staking.withdrawUnbonded')}
              disabled={!isWithdrawUnbondedPermitted}
              onClick={withdrawUnbonded}
            />
          </styled.WithdrawColumn>
          {!!stakingInfo?.nominators?.length && (
            <styled.StopStaking>
              <Button
                variant="primary"
                icon="stop"
                wide={false}
                label={t('staking.stopStaking')}
                onClick={stopStaking}
              />
            </styled.StopStaking>
          )}

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
