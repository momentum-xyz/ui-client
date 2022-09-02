import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import cn from 'classnames';

import logo from 'static/images/momentum.svg';

import * as styled from './WorldBuilderHeader.styled';

interface PropsInterface {
  size?: 'small' | 'normal';
}

const WorldBuilderHeader: FC<PropsInterface> = ({size = 'normal'}) => {
  const {t} = useTranslation();

  return (
    <styled.LogoContainer className={cn(size)}>
      <styled.Logo src={logo} className={cn(size)} />
      <styled.Title
        label={t('titles.worldBuilder')}
        transform="uppercase"
        type="h1"
        className={cn(size)}
      />
    </styled.LogoContainer>
  );
};

export default WorldBuilderHeader;
