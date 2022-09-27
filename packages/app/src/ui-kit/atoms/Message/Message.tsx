import React, {FC} from 'react';
import {PropsWithThemeInterface} from '@momentum/ui-kit';
import {MessageType} from 'ui-kit/types';

import * as styled from './Message.styled';

interface MessagePropsInterface extends PropsWithThemeInterface {
  type: MessageType;
}

const Message: FC<MessagePropsInterface> = (props) => {
  const {children, type} = props;
  const content = () => {
    switch (type) {
      case 'info':
        return <styled.InfoMessage data-testid="Message-test">{children}</styled.InfoMessage>;
      case 'warning':
        return <styled.WarningMessage data-testid="Message-test">{children}</styled.WarningMessage>;
      case 'danger':
        return <styled.DangerMessage data-testid="Message-test">{children}</styled.DangerMessage>;
      case 'neutral':
        return <styled.NeutralMessage data-testid="Message-test">{children}</styled.NeutralMessage>;
      case 'success':
        return <styled.SuccessMessage data-testid="Message-test">{children}</styled.SuccessMessage>;
    }
  };

  return content();
};

export default Message;
