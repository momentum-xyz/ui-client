import React, {FC} from 'react';

import {PropsWithThemeInterface} from '../../interfaces';

import * as styled from './Loader.styled';

const Loader: FC<PropsWithThemeInterface> = (props) => {
  return (
    <styled.Container data-testid="Loader-test" theme={props.theme}>
      <styled.Item />
      <styled.Item />
      <styled.Item />
    </styled.Container>
  );
};

export default Loader;
