import React, {FC} from 'react';

import {PropsWithThemeInterface} from '../../interfaces';

import * as styled from './ToolbarIconSeparator.styled';

const ToolbarIconSeparator: FC<PropsWithThemeInterface> = (props) => (
  <styled.Container data-testid="ToolbarIconSeparator-test" />
);

export default ToolbarIconSeparator;
