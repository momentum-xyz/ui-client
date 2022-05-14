import React from 'react';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';

import {Button, Heading} from 'ui-kit';
import {useStore} from 'shared/hooks';

import {
  ActiveStake,
  AccountSection,
  BalanceList,
  RewardSection,
  ScannerList,
  StakingAmountSection
} from './component';
import * as styled from './Nominator.styled';

type NominatorProps = {
  nextTab: () => void;
};

const Nominator = ({nextTab}: NominatorProps) => {
  const {polkadotProviderStore} = useStore().widgetStore.stakingStore;
  const {paymentDestination, controllerAccountValidation, bondAmountValidation} =
    polkadotProviderStore;

  return (
    <styled.Container>
      <AccountSection />
      <styled.Holder>
        <Heading type="h2" align="left" weight="bold" label={t('staking.stashBalance')} />
        <ScannerList />
      </styled.Holder>
      <BalanceList />
      <ActiveStake />
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
          onClick={nextTab}
        />
      </styled.ButtonContainer>
    </styled.Container>
  );
};
export default observer(Nominator);
