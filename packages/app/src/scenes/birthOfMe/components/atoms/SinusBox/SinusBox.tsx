import React, {FC} from 'react';
import {IconSvg} from '@momentum-xyz/ui-kit';

import * as styled from './SinusBox.styled';

const SinusBox: FC = () => {
  return (
    <styled.Div>
      <IconSvg name="sound" size="large" />
    </styled.Div>
  );
};

export default SinusBox;
