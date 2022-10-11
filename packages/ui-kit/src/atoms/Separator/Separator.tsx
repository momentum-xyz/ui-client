import React, {FC} from 'react';

import {PropsWithThemeInterface} from '../../interfaces';

import * as styled from './Separator.styled';

const Separator: FC<PropsWithThemeInterface> = () => {
  return <styled.Container data-testid="Separator-test" />;
};

export default Separator;
