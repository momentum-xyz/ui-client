import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import * as styled from './HomePage.styled';

const HomePage: FC = () => {
  return <styled.Container data-testid="HomePage-test"></styled.Container>;
};

export default observer(HomePage);
