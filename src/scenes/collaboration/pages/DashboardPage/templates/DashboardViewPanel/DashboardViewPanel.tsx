import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import * as styled from './DashboardViewPanel.styled';

const DashboardViewPanel: FC = () => {
  return (
    <styled.Container>
      <styled.Content>
        <styled.CoreContainer></styled.CoreContainer>
      </styled.Content>
    </styled.Container>
  );
};

export default observer(DashboardViewPanel);
