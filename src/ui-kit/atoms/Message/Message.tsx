import React, {FC} from 'react';

import {MessageType} from 'core/types';
import {PropsWithThemeInterface} from 'ui-kit/interfaces';

import * as styled from './Message.styled';

interface MessagePropsInterface extends PropsWithThemeInterface {
  type: MessageType;
}

const Message: FC<MessagePropsInterface> = (props) => {
  const {children, type} = props;
  const content = () => {
    switch (type) {
      case 'info':
        return <styled.InfoMessage>{children}</styled.InfoMessage>;
      case 'warning':
        return <styled.WarningMessage>{children}</styled.WarningMessage>;
      case 'danger':
        return <styled.DangerMessage>{children}</styled.DangerMessage>;
      case 'neutral':
        return <styled.NeutralMessage>{children}</styled.NeutralMessage>;
      case 'success':
        return <styled.SuccessMessage>{children}</styled.SuccessMessage>;
    }
  };

  return content();
};

export default Message;
