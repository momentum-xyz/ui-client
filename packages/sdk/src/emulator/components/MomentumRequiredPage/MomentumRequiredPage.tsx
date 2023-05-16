import React, {FC} from 'react';

import * as styled from './MomentumRequiredPage.styled';

const MomentumRequiredPage: FC = () => {
  return (
    <styled.Container>
      Momentum is required to run this plugin, please use momentum to access this plugin.
    </styled.Container>
  );
};

export default MomentumRequiredPage;
