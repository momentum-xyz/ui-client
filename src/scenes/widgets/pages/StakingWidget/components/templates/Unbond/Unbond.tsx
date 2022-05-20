import React, {FC} from 'react';
import {t} from 'i18next';

import {Button, Heading, Text} from 'ui-kit';
import {useStore} from 'shared/hooks/useStore';

import * as styled from './Unbond.styled';
import {UnbondDetails, UnbondAmountSection, UnbondAmountValidation} from './components';

interface PropsInterface {
  nominatorTab: () => void;
  authorizationTab: () => void;
}

export const Unbond: FC<PropsInterface> = ({nominatorTab, authorizationTab}) => {
  const {unbondAmountValidation} = useStore().widgetStore.stakingStore.polkadotProviderStore;
  return (
    <styled.Container>
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
          label={t('back')}
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
