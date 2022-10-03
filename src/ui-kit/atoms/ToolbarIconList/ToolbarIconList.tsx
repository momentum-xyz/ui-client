import React, {FC} from 'react';

import {PropsWithThemeInterface} from 'ui-kit/interfaces';

import * as styled from './ToolbarIconList.styled';

const ToolbarIconList: FC<PropsWithThemeInterface> = ({children}) => (
  <styled.Container data-testid="ToolbarIconList-test">{children}</styled.Container>
);

export default ToolbarIconList;
