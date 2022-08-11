import React, {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {RtmChannel, RtmTextMessage} from 'agora-rtm-sdk';

import {Text, TextArea} from 'ui-kit';
import {dateToTime} from 'core/utils';
import {MessageInterface} from 'core/interfaces';

import * as styled from './TextChat.styled';

interface PropsInterface {
  sendMessage: (message: RtmTextMessage) => void;
  currentChannel: RtmChannel | null;
  messages: Array<MessageInterface>;
  userId: string;
}

const TextChat: FC<PropsInterface> = ({sendMessage, currentChannel, messages, userId}) => {
  const [message, setMessage] = useState<string>('');

  const handleMessageChange = (value: string) => {
    const text = value;
    if (text[text.length - 1] !== '\n') {
      setMessage(value);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (message.trim().length !== 0) {
        if (currentChannel) {
          sendMessage({
            messageType: 'TEXT',
            text: message.trim()
          });
          console.info(`Message sent: "${message.trim()}"`);
        }
        setMessage('');
      }
    }
  };

  return (
    <styled.Container>
      <styled.ChatBox>
        {messages.map((message, index) =>
          message.messageType === 'SYSTEM' ? (
            <styled.TextContainer key={index}>
              <styled.InnerContainer>
                <styled.Text>{message?.text || ''}</styled.Text>
                <styled.Time>{dateToTime(message.date)}</styled.Time>
              </styled.InnerContainer>
            </styled.TextContainer>
          ) : (
            <styled.TextContainer key={index}>
              <styled.InnerContainer>
                <styled.StyledHeading
                  label={message.author === userId ? 'you' : message?.name || message.author}
                  transform="uppercase"
                  type="h2"
                  align="left"
                />
                <Text text={dateToTime(message.date)} size="m" />
              </styled.InnerContainer>
              <styled.Message>{message.text}</styled.Message>
            </styled.TextContainer>
          )
        )}
      </styled.ChatBox>
      <styled.TextBox>
        <TextArea
          name=""
          isResizable
          placeholder="Message"
          onChange={handleMessageChange}
          onKeyUp={handleKeyUp}
          value={message}
          bottomBorder={true}
        />
      </styled.TextBox>
    </styled.Container>
  );
};

export default observer(TextChat);
