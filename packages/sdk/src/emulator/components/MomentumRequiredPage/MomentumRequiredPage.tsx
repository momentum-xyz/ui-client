import React, {FC} from 'react';
import {PropsWithThemeInterface, Text} from '@momentum-xyz/ui-kit';

import * as styled from './MomentumRequiredPage.styled';

const MomentumRequiredPage: FC<PropsWithThemeInterface> = () => {
  return (
    <styled.Container>
      <Text
        size="l"
        text="Momentum is required to run this plugin, please use momentum to access this plugin."
        weight="bold"
      />
    </styled.Container>
  );
};

export default MomentumRequiredPage;
