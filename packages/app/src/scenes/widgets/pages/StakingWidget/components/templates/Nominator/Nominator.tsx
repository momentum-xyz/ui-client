import React, {FC, useCallback, useEffect, useState} from 'react';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';
import {DeriveBalancesAll, DeriveStakingAccount} from '@polkadot/api-derive/types';
import {Heading, Button} from '@momentum/ui-kit';

import {UnsubscribeType} from 'core/types';
import {useStore} from 'shared/hooks';
import {StakingTransactionEnum} from 'core/enums';

import {Unbond} from '../index';

import {
  ActiveStake,
  AccountSection,
  BalanceList,
  RewardSection,
  ScannerList,
  StakingAmountSection
} from './components';
import * as styled from './Nominator.styled';

interface PropsInterface {
  goToValidators: () => void;
  goToAuthorization: () => void;
}

const Nominator: FC<PropsInterface> = ({goToAuthorization, goToValidators}) => {
  const {polkadotProviderStore} = useStore().widgetStore.stakingStore;
  const {
    paymentDestination,
    controllerAccountValidation,
    bondAmountValidation,
    setTransactionType,
    channel,
    setStakingInfo,
    setStashBalanceAll,
    setControllerBalanceAll,
    controllerAccount,
    stashAccount,
    setSessionProgress,
    customPaymentDestination,
    setCustomRewardDestinationBalance,
    hasCustomRewardValidation
  } = polkadotProviderStore;
  const [section, setSection] = useState<'nominator' | 'unbond'>('nominator');

  const stakingSubscription = useCallback(
    async () =>
      await channel?.derive.staking.account(
        stashAccount?.address as string,
        (payload: DeriveStakingAccount) => setStakingInfo(payload)
      ),
    [channel, stashAccount?.address, setStakingInfo]
  );

  const stashBalanceSubscription = useCallback(
    async () =>
      await channel?.derive.balances?.all(
        stashAccount?.address as string,
        (payload: DeriveBalancesAll) => setStashBalanceAll(payload)
      ),
    [channel, setStashBalanceAll, stashAccount?.address]
  );

  const controllerBalanceSubscription = useCallback(
    async () =>
      await channel?.derive.balances?.all(
        controllerAccount?.address as string,
        (payload: DeriveBalancesAll) => setControllerBalanceAll(payload)
      ),
    [channel, setControllerBalanceAll, controllerAccount?.address]
  );

  const balanceRewardSubscription = useCallback(
    async () =>
      await channel?.derive.balances?.all(customPaymentDestination, (payload: DeriveBalancesAll) =>
        setCustomRewardDestinationBalance(payload)
      ),
    [channel, customPaymentDestination, setCustomRewardDestinationBalance]
  );

  const sessionProgressSubscription = useCallback(
    async () => await channel?.derive.session.progress((payload) => setSessionProgress(payload)),
    [channel, setSessionProgress]
  );

  useEffect(() => {
    let unsubscribe: UnsubscribeType | undefined;
    stashBalanceSubscription().then((unsub) => {
      unsubscribe = unsub;
    });

    return () => unsubscribe && unsubscribe();
  }, [stashBalanceSubscription]);

  useEffect(() => {
    let unsubscribe: UnsubscribeType | undefined;
    customPaymentDestination &&
      balanceRewardSubscription().then((unsub) => {
        unsubscribe = unsub;
      });

    return () => unsubscribe && unsubscribe();
  }, [balanceRewardSubscription, customPaymentDestination]);

  useEffect(() => {
    let unsubscribe: UnsubscribeType | undefined;
    controllerAccount?.address &&
      controllerBalanceSubscription().then((unsub) => {
        unsubscribe = unsub;
      });

    return () => unsubscribe && unsubscribe();
  }, [controllerBalanceSubscription, controllerAccount?.address]);

  useEffect(() => {
    let unsubscribe: UnsubscribeType | undefined;
    stakingSubscription().then((unsub) => {
      unsubscribe = unsub;
    });

    return () => unsubscribe && unsubscribe();
  }, [stakingSubscription]);

  useEffect(() => {
    let unsubscribe: UnsubscribeType | undefined;
    sessionProgressSubscription().then((unsub) => {
      unsubscribe = unsub;
    });

    return () => unsubscribe && unsubscribe();
  }, [sessionProgressSubscription]);

  useEffect(() => {
    setTransactionType(StakingTransactionEnum.Bond);
  }, [setTransactionType]);

  return section === 'nominator' ? (
    <styled.Container data-testid="Nominator-test">
      <AccountSection />
      <styled.Holder>
        <Heading type="h2" align="left" weight="bold" label={t('staking.stashBalance')} />
        <ScannerList />
      </styled.Holder>
      <BalanceList />
      <ActiveStake goToUnbond={() => setSection('unbond')} goToAuthorization={goToAuthorization} />
      <RewardSection />
      <StakingAmountSection />
      <styled.ButtonContainer>
        <Button
          variant="primary"
          label={t('staking.nominate')}
          disabled={
            controllerAccountValidation.isNominatorAcceptable ||
            hasCustomRewardValidation ||
            bondAmountValidation.isBondAmountAcceptable ||
            !paymentDestination
          }
          icon="lightningDuotone"
          wide={false}
          onClick={goToValidators}
        />
      </styled.ButtonContainer>
    </styled.Container>
  ) : (
    <Unbond nominatorTab={() => setSection('nominator')} authorizationTab={goToAuthorization} />
  );
};
export default observer(Nominator);
