import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';

import logo from 'static/images/momentum.svg';

import * as styled from './WorldBuilderHeader.styled';

interface PropsInterface {
  size?: 'small' | 'normal';
}

const WorldBuilderHeader: FC<PropsInterface> = ({size = 'normal'}) => {
  const {t} = useTranslation();

  return (
    <styled.LogoContainer className={size}>
      <styled.Logo src={logo} className={size} />
      <styled.Title
        label={t('titles.worldBuilder')}
        transform="uppercase"
        type="h1"
        className={size}
      />
    </styled.LogoContainer>
  );
};

export default WorldBuilderHeader;
