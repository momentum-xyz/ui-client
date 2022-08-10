import React, {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';

import {Text, TextArea} from 'ui-kit';
import {useStore} from 'shared/hooks';

import * as styled from './TextChat.styled';

const dateToTimeString = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const stringHours = (hours < 10 ? '0' : '') + hours;
  const stringMinutes = (minutes < 10 ? '0' : '') + minutes;

  return `${stringHours}:${stringMinutes}`;
};

const TextChat: FC = () => {
  const {collaborationStore, sessionStore} = useStore();
  const {textChatStore} = collaborationStore;
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (textChatStore.currentChannel) {
      textChatStore.currentChannel.on('ChannelMessage', async (text, memberId) => {
        await textChatStore.fetchUser(memberId);
        textChatStore.setMessages(text, memberId);
      });
    }
  }, [textChatStore.currentChannel]);

  const handleMessageChange = (value: string) => {
    const text = value;
    if (text[text.length - 1] !== '\n') {
      setMessage(value);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (message.trim().length !== 0) {
        if (textChatStore.currentChannel) {
          textChatStore.sendMessage({
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
        {textChatStore?.messages?.map((message, index) =>
          message.messageType === 'SYSTEM' ? (
            <styled.TextContainer key={index}>
              <div className="font-bold text-base uppercase gap-1 flex justify-between">
                <styled.Text>{message?.text || ''}</styled.Text>
                <styled.Time>{dateToTimeString(message.date)}</styled.Time>
              </div>
            </styled.TextContainer>
          ) : (
            <styled.TextContainer key={index}>
              <styled.InnerContainer>
                <styled.StyledHeading
                  label={
                    message.author === sessionStore.userId ? 'you' : message?.name || message.author
                  }
                  transform="uppercase"
                  type="h2"
                  align="left"
                />
                <Text text={dateToTimeString(message.date)} size="m" />
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
