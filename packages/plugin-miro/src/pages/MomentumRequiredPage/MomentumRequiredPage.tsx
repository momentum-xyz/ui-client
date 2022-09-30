import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Heading, PropsWithThemeInterface} from '@momentum/ui-kit';

import * as styled from './MomentumRequiredPage.styled';

const MomentumRequiredPage: FC<PropsWithThemeInterface> = () => {
  const {t} = useTranslation();

  return (
    <styled.Container>
      <Heading type="h1" label={t('messages.momentumRequired')} />
    </styled.Container>
  );
};

export default MomentumRequiredPage;
