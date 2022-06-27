import React, {FC, useCallback, useEffect, useState} from 'react';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';
import {DeriveBalancesAll, DeriveStakingAccount} from '@polkadot/api-derive/types';

import { UnsubscribeType } from "core/types";
import {Button, Heading} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {StakingTransactionType} from 'core/enums';


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
    setBalanceAll,
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

  const balanceSubscription = useCallback(
    async (address: string) =>
      await channel?.derive.balances?.all(address, (payload: DeriveBalancesAll) =>
        setBalanceAll(payload)
      ),
    [channel, setBalanceAll]
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
    stashAccount?.address &&
      balanceSubscription(stashAccount?.address).then((unsub) => {
        unsubscribe = unsub;
      });

    return () => unsubscribe && unsubscribe();
  }, [balanceSubscription, stashAccount?.address]);

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
      balanceSubscription(controllerAccount?.address).then((unsub) => {
        unsubscribe = unsub;
      });

    return () => unsubscribe && unsubscribe();
  }, [balanceSubscription, controllerAccount?.address]);

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
    setTransactionType(StakingTransactionType.Bond);
  }, [setTransactionType]);

  return section === 'nominator' ? (
    <styled.Container>
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
