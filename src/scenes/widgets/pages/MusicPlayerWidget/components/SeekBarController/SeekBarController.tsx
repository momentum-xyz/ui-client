import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import * as styled from './SeekBarController.styled';

export interface PropsInterface {}

const SeekBarController: FC<PropsInterface> = () => {
  return (
    <styled.Container>
      <styled.Div></styled.Div>
    </styled.Container>
  );
};

export default observer(SeekBarController);
