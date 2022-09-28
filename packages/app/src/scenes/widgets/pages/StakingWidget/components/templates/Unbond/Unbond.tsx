import React, {FC, useEffect} from 'react';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';
import {Heading} from '@momentum/ui-kit';

import {Button, Text} from 'ui-kit';
import {useStore} from 'shared/hooks/useStore';
import {StakingTransactionEnum} from 'core/enums';

import * as styled from './Unbond.styled';
import {UnbondDetails, UnbondAmountSection, UnbondAmountValidation} from './components';

interface PropsInterface {
  nominatorTab: () => void;
  authorizationTab: () => void;
}

const Unbond: FC<PropsInterface> = ({nominatorTab, authorizationTab}) => {
  const {unbondAmountValidation, setTransactionType} =
    useStore().widgetStore.stakingStore.polkadotProviderStore;
  useEffect(() => {
    setTransactionType(StakingTransactionEnum.Unbond);
  }, [setTransactionType]);
  return (
    <styled.Container data-testid="Unbond-test">
      <Heading type="h2" align="left" weight="bold" label={t('staking.accountPair')} />
      <styled.TextContainer>
        <Text text={t('staking.unbondingInfoAccounts')} size="s" align="left" />
      </styled.TextContainer>
      <UnbondDetails />
      <styled.TextContainer>
        <Text text={t('staking.unbondingPeriod')} size="s" align="left" />
      </styled.TextContainer>
      <UnbondAmountSection />
      <UnbondAmountValidation />
      <styled.ButtonContainer>
        <Button
          variant="primary"
          label={t('actions.back')}
          icon="lightningDuotone"
          wide={false}
          onClick={nominatorTab}
        />
        <Button
          variant="primary"
          label={t('staking.unbond')}
          disabled={unbondAmountValidation.isBondAmountAcceptable}
          icon="lightningDuotone"
          wide={false}
          onClick={authorizationTab}
        />
      </styled.ButtonContainer>
    </styled.Container>
  );
};

export default observer(Unbond);
