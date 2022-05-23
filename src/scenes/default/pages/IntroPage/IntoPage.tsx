import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import * as styled from './IntoPage.styled';

const IntoPage: FC = () => {
  return <styled.Div>Video.</styled.Div>;
};

export default observer(IntoPage);
