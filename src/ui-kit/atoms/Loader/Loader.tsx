import React, {FC} from 'react';

import * as styled from './Loader.styled';

const Loader: FC = () => {
  return (
    <styled.Container>
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </styled.Container>
  );
};

export default Loader;
