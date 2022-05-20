import React, {FC} from 'react';
import {t} from 'i18next';

import {Button, Heading, Text} from 'ui-kit';

import * as styled from './Unbond.styled';
import {UnbondDetails} from './components';
import UnbondAmountSection from './components/UnbondAmountSection/UnbondAmountSection';
import UnbondAmountValidation from './components/UnbondAmountValidation/UnbondAmountValidation';

interface PropsInterface {
  nominatorTab: () => void;
  authorizationTab: () => void;
}

export const Unbond: FC<PropsInterface> = ({nominatorTab, authorizationTab}) => {
  return (
    <styled.Container>
      <Heading type="h2" align="left" weight="bold" label={t('staking.accountPair')} />
      <Text text={t('staking.unbondingInfoAccounts')} size="s" align="left" />
      <UnbondDetails />
      <Text text={t('staking.unbondingPeriod')} size="s" align="left" />
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
          icon="lightningDuotone"
          wide={false}
          onClick={authorizationTab}
        />
      </styled.ButtonContainer>
    </styled.Container>
  );
};
