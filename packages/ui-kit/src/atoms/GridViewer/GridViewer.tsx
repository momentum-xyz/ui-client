import React, {FC} from 'react';

import {PropsWithThemeInterface} from '../../interfaces';

import * as styled from './GridViewer.styled';

const GridViewer: FC<PropsWithThemeInterface> = ({children}) => (
  <styled.Grid>{children}</styled.Grid>
);

export default GridViewer;
