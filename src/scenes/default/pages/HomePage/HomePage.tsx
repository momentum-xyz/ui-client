import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {ExplorePanel, OnlineUsersPanel} from './components';
import * as styled from './HomePage.styled';

const HomePage: FC = () => {
  return (
    <styled.Container>
      <styled.PanelWrapper>
        <ExplorePanel />
      </styled.PanelWrapper>
      <styled.PanelWrapper>
        <OnlineUsersPanel />
      </styled.PanelWrapper>
    </styled.Container>
  );
};

export default observer(HomePage);
