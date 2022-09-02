import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';

import logo from 'static/images/momentum.svg';

import * as styled from './WorldBuilderHeader.styled';

const WorldBuilderHeader: FC = () => {
  const {t} = useTranslation();

  return (
    <styled.LogoContainer>
      <styled.Logo src={logo} />
      <styled.Title label={t('titles.worldBuilder')} transform="uppercase" type="h1" />
    </styled.LogoContainer>
  );
};

export default WorldBuilderHeader;
