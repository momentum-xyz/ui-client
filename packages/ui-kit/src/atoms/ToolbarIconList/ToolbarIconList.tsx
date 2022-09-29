import React, {FC, ReactNode} from 'react';

import {PropsWithThemeInterface} from '../../interfaces';

import * as styled from './ToolbarIconList.styled';

interface PropsInterface extends PropsWithThemeInterface {
  children?: ReactNode;
}

const ToolbarIconList: FC<PropsInterface> = (props) => (
  <styled.Container data-testid="ToolbarIconList-test">{props.children}</styled.Container>
);

export default ToolbarIconList;
