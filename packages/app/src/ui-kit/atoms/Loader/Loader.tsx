import React, {FC} from 'react';
import {PropsWithThemeInterface} from '@momentum/ui-kit';

import * as styled from './Loader.styled';

const Loader: FC<PropsWithThemeInterface> = () => {
  return (
    <styled.Container data-testid="Loader-test">
      <styled.Item />
      <styled.Item />
      <styled.Item />
    </styled.Container>
  );
};

export default Loader;
