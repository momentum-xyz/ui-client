import React, {FC, useEffect, useState} from 'react';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';

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
    setTransactionType
  } = polkadotProviderStore;
  const [section, setSection] = useState<'nominator' | 'unbond'>('nominator');

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
