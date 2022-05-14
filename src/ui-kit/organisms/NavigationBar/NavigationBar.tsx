import React, {FC} from 'react';

import {PropsWithThemeInterface} from '../../interfaces';

import * as styled from './NavigationBar.styled';

const NavigationBar: FC<PropsWithThemeInterface> = ({children, theme}) => {
  return <styled.Container theme={theme}>{children}</styled.Container>;
};

export default NavigationBar;
