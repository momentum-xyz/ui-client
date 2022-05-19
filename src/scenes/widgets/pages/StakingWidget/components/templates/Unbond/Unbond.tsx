import React, {FC} from 'react';
import {t} from 'i18next';

import {Button, Text} from 'ui-kit';

import * as styled from './Unbond.styled';

interface PropsInterface {
  nominatorTab: () => void;
  authorizationTab: () => void;
}

export const Unbond: FC<PropsInterface> = ({nominatorTab, authorizationTab}) => {
  return (
    <styled.Container>
      <Text text={t('staking.unbondingInfoAccounts')} size="s" />
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
