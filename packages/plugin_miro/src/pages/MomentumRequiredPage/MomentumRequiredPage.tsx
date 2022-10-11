import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {PropsWithThemeInterface, Text} from '@momentum-xyz/ui-kit';

import * as styled from './MomentumRequiredPage.styled';

const MomentumRequiredPage: FC<PropsWithThemeInterface> = () => {
  const {t} = useTranslation();

  return (
    <styled.Container>
      <Text size="l" text={t('messages.momentumRequired')} weight="bold" />
    </styled.Container>
  );
};

export default MomentumRequiredPage;
