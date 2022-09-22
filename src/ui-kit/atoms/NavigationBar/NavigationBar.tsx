import React, {FC} from 'react';

import {PropsWithThemeInterface} from 'ui-kit/interfaces';

import * as styled from './NavigationBar.styled';

const NavigationBar: FC<PropsWithThemeInterface> = ({children, theme}) => {
  return (
    <styled.Container theme={theme} data-testid="NavigationBar-test">
      {children}
    </styled.Container>
  );
};

export default NavigationBar;
