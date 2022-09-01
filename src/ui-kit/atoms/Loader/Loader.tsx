import React, {FC} from 'react';

import * as styled from './Loader.styled';

const Loader: FC = () => {
  return (
    <styled.Container data-testid="Loader-test">
      <styled.Item />
      <styled.Item />
      <styled.Item />
    </styled.Container>
  );
};

export default Loader;
