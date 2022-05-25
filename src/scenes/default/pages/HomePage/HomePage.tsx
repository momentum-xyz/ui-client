import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {ExplorePanel, OnlineUsersPanel} from './components';
import * as styled from './HomePage.styled';

/* Just for sample */

const HomePage: FC = () => {
  return (
    <styled.Container>
      <ExplorePanel />
      <OnlineUsersPanel />
    </styled.Container>
  );
};

export default observer(HomePage);
