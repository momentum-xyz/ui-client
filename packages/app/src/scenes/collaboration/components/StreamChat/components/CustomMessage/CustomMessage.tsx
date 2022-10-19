import React, {FC} from 'react';
import {Message, useMessageContext} from 'stream-chat-react';

export const CustomMessage: FC = () => {
  const {message} = useMessageContext();

  // these are considered Markdown bullet list marks
  // we were recommended to turn it off if we don't want this behavior
  // https://github.com/GetStream/stream-chat-react/issues/1816#issuecomment-1280380278
  const fallbackToPlain = message.text === '+' || message.text === '-';

  return (
    <Message
      message={message}
      renderText={
        fallbackToPlain
          ? (text) => {
              return <div>{text}</div>;
            }
          : undefined
      }
    />
  );
};
