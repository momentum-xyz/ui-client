import React, {FC, PropsWithChildren} from 'react';

import {PropsWithThemeInterface} from '../../interfaces';

import * as styled from './NavigationBar.styled';

const NavigationBar: FC<PropsWithChildren<PropsWithThemeInterface>> = (props) => {
  return (
    <styled.Container theme={props.theme} data-testid="NavigationBar-test">
      {props.children}
    </styled.Container>
  );
};

export default NavigationBar;
