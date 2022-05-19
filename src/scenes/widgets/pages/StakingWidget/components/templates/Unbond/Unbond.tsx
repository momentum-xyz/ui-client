import React, {FC} from 'react';
import {t} from 'i18next';

import {Button, Heading, Input, PropsWithThemeInterface, Text} from 'ui-kit';

import * as styled from './Unbond.styled';
import {UnbondDetails} from './components';

interface PropsInterface extends PropsWithThemeInterface {
  nominatorTab: () => void;
  authorizationTab: () => void;
}

export const Unbond: FC<PropsInterface> = ({nominatorTab, authorizationTab, theme}) => {
  const unbondAmount = '';
  const unbondAmountHandler = () => {};
  return (
    <styled.Container>
      <Heading type="h2" align="left" weight="bold" label={t('staking.accountPair')} />
      <Text text={t('staking.unbondingInfoAccounts')} size="s" align="left" />
      <UnbondDetails />
      <Text text={t('staking.unbondingPeriod')} size="s" align="left" />
      <styled.FormField>
        <styled.LabelContainer>
          <Text
            theme={theme}
            text={t('staking.unbondAmount')}
            size="xxs"
            align="right"
            weight="bold"
            transform="uppercase"
          />
        </styled.LabelContainer>
        <Input
          value={unbondAmount}
          onChange={unbondAmountHandler}
          label=""
          placeholder={t('staking.selectAmount')}
        />
      </styled.FormField>
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
