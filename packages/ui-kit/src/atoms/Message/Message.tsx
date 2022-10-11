import React, {FC, ReactNode} from 'react';

import {PropsWithThemeInterface} from '../../interfaces';
import {MessageType} from '../../types';

import * as styled from './Message.styled';

interface MessagePropsInterface extends PropsWithThemeInterface {
  type: MessageType;
  children: ReactNode;
}

const Message: FC<MessagePropsInterface> = (props) => {
  const {type} = props;
  const content = () => {
    switch (type) {
      case 'info':
        return <styled.InfoMessage data-testid="Message-test">{props.children}</styled.InfoMessage>;
      case 'warning':
        return (
          <styled.WarningMessage data-testid="Message-test">{props.children}</styled.WarningMessage>
        );
      case 'danger':
        return (
          <styled.DangerMessage data-testid="Message-test">{props.children}</styled.DangerMessage>
        );
      case 'neutral':
        return (
          <styled.NeutralMessage data-testid="Message-test">{props.children}</styled.NeutralMessage>
        );
      case 'success':
        return (
          <styled.SuccessMessage data-testid="Message-test">{props.children}</styled.SuccessMessage>
        );
    }
  };

  return content();
};

export default Message;
