import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import * as styled from './OdysseyHomePage.styled';

const OdysseyHomePage: FC = () => {
  return <styled.Container data-testid="OdysseyHomePage-test" />;
};

export default observer(OdysseyHomePage);
