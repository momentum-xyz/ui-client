import React, {FC} from 'react';

import {PropsWithThemeInterface} from '../../interfaces';

import * as styled from './ToolbarIconList.styled';

const ToolbarIconList: FC<PropsWithThemeInterface> = (props) => (
  <styled.Container data-testid="ToolbarIconList-test">{props.children}</styled.Container>
);

export default ToolbarIconList;
