import React, {FC} from 'react';
import {PropsWithThemeInterface} from '@momentum/ui-kit';

import * as styled from './Separator.styled';

const Separator: FC<PropsWithThemeInterface> = () => {
  return <styled.Container data-testid="Separator-test" />;
};

export default Separator;
