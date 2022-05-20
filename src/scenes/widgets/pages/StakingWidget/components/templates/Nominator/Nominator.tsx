import React, {FC, useState} from 'react';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';

import {Button, Heading} from 'ui-kit';
import {useStore} from 'shared/hooks';

import {Unbond} from '../index';

import {
  ActiveStake,
  AccountSection,
  BalanceList,
  RewardSection,
  ScannerList,
  StakingAmountSection
} from './component';
import * as styled from './Nominator.styled';

interface PropsInterface {
  validatorsTab: () => void;
  authorizationTab: () => void;
}

const Nominator: FC<PropsInterface> = ({authorizationTab, validatorsTab}) => {
  const {paymentDestination, controllerAccountValidation, bondAmountValidation} =
    useStore().widgetStore.stakingStore.polkadotProviderStore;
  const [section, setSection] = useState<'nominator' | 'unbond'>('nominator');

  return section === 'nominator' ? (
    <styled.Container>
      <AccountSection />
      <styled.Holder>
        <Heading type="h2" align="left" weight="bold" label={t('staking.stashBalance')} />
        <ScannerList />
      </styled.Holder>
      <BalanceList />
      <ActiveStake unbond={() => setSection('unbond')} />
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
          onClick={validatorsTab}
        />
      </styled.ButtonContainer>
    </styled.Container>
  ) : (
    <Unbond nominatorTab={() => setSection('nominator')} authorizationTab={authorizationTab} />
  );
};
export default observer(Nominator);
