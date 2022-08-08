import React, {FC} from 'react';

import {Portal} from 'ui-kit';

import * as styled from './TextChat.styled';

const TextChat: FC = () => {
  return (
    <Portal>
      <styled.Container></styled.Container>
    </Portal>
  );
};

export default TextChat;
