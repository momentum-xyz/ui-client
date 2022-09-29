import React, {FC, ReactNode} from 'react';

import {PropsWithThemeInterface} from '../../interfaces';

import * as styled from './NavigationBar.styled';

interface PropsInterface extends PropsWithThemeInterface {
  children?: ReactNode;
}

const NavigationBar: FC<PropsInterface> = (props) => {
  return (
    <styled.Container theme={props.theme} data-testid="NavigationBar-test">
      {props.children}
    </styled.Container>
  );
};

export default NavigationBar;
