import React, {FC} from 'react';

import * as styled from './ToolbarIconList.styled';

const ToolbarIconList: FC = ({children}) => (
  <styled.Container data-testid="ToolbarIconList-test">{children}</styled.Container>
);

export default ToolbarIconList;
