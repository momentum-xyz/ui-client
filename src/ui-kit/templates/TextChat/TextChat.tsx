import React, {FC, useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {RtmChannel, RtmTextMessage} from 'agora-rtm-sdk';
import {t} from 'i18next';

import {Text, TextArea} from 'ui-kit';
import {dateToTime} from 'core/utils';
import {MessageInterface} from 'core/interfaces';
import {TextMessageEnum} from 'core/enums';

import * as styled from './TextChat.styled';

interface PropsInterface {
  sendMessage: (message: RtmTextMessage) => void;
  currentChannel: RtmChannel | null;
  messages: Array<MessageInterface>;
  userId: string;
  messageSent: boolean;
}

const TextChat: FC<PropsInterface> = ({
  sendMessage,
  currentChannel,
  messages,
  userId,
  messageSent
}) => {
  const messageListRef = useRef<HTMLUListElement>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (messageListRef) {
      const list: HTMLUListElement | null = messageListRef.current;
      if (list) {
        list.scrollTop = list.scrollHeight;
      }
    }
  }, [messageSent]);

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
            messageType: TextMessageEnum.TEXT,
            text: message.trim()
          });
        }
        setMessage('');
      }
    }
  };

  if (!currentChannel) {
    return null;
  }

  return (
    <styled.Container>
      <styled.ChatBox ref={messageListRef}>
        {messages.map((message, index) =>
          message.messageType === TextMessageEnum.SYSTEM ? (
            <styled.TextContainer key={index}>
              <styled.InnerContainer>
                <styled.TextWrapper>
                  <styled.Text>{message?.text || ''}</styled.Text>
                </styled.TextWrapper>
                <styled.Time>{dateToTime(message.date)}</styled.Time>
              </styled.InnerContainer>
            </styled.TextContainer>
          ) : (
            <styled.TextContainer key={index}>
              <styled.InnerContainer>
                <styled.StyledHeading
                  label={
                    message.author === userId
                      ? t('textMessage.you')
                      : message?.name || message.author
                  }
                  transform="uppercase"
                  type="h3"
                  align="left"
                />
                <Text text={dateToTime(message.date)} size="s" />
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
          placeholder={t('textMessage.placeholder')}
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
