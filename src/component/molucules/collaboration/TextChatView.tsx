import React, {useEffect, useRef, useState} from 'react';

import useCollaboration from '../../../context/Collaboration/hooks/useCollaboration';
import {Message, useTextChatContext} from '../../../context/TextChatContext';
import {TextArea} from '../../atoms/input/Input';
import Panel from '../../atoms/Panel';

export interface TextChatViewProps {}

const dateToTimeString = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const stringHours = (hours < 10 ? '0' : '') + hours;
  const stringMinutes = (minutes < 10 ? '0' : '') + minutes;

  return `${stringHours}:${stringMinutes}`;
};

const TextChatView: React.FC<TextChatViewProps> = () => {
  const {collaborationState} = useCollaboration();

  const open = collaborationState.chatOpen && !!collaborationState.collaborationSpace;

  const {
    messages,
    currentChannel,
    sendMessage,
    currentUserId,
    setNumberOfUnreadMessages,
    users,
    numberOfReadMessages,
    setNumberOfReadMessages
  } = useTextChatContext();

  const messageListRef = useRef<HTMLUListElement>(null);

  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const numberOfMessagesOfOtherUsers = messages.filter(
      (item) => item.messageType !== 'SYSTEM' && item.author !== currentUserId
    ).length;

    if (open) {
      setNumberOfReadMessages(numberOfMessagesOfOtherUsers);
      setNumberOfUnreadMessages(0);
    } else {
      setNumberOfUnreadMessages(numberOfMessagesOfOtherUsers - numberOfReadMessages);
    }
  }, [messages, open]);

  useEffect(() => {
    if (messageListRef) {
      const list: HTMLUListElement | null = messageListRef.current;
      if (list) {
        list.scrollTop = list.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    if (messageListRef) {
      const list: HTMLUListElement | null = messageListRef.current;
      if (list) {
        list.scrollTop = list.scrollHeight;
      }
    }
  }, [open]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.currentTarget.value;

    if (text[text.length - 1] !== '\n') {
      setMessage(e.currentTarget.value);
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

  if (!open) {
    return null;
  }

  return (
    <Panel className="w-1/3 ml-1" padding={false}>
      <ul className="p-2 flex-grow overflow-y-auto overflow-x-hidden" ref={messageListRef}>
        {messages.map((message: Message, index) => {
          // const direction: string = message.author === id ? 'out' : 'in';
          if (message.messageType === 'SYSTEM') {
            return (
              <li key={index} className={` border-b-1 py-1 border-prime-blue-20`}>
                <span className="font-bold text-base uppercase flex justify-between text-red-sunset-100">
                  <div className="text-sm text-white-40">{message?.text || ''}</div>
                  <time className="font-normal text-white-50">
                    {dateToTimeString(message.date)}
                  </time>
                </span>
              </li>
            );
          }
          return (
            <li key={index} className={` border-b-1 py-1 border-prime-blue-20`}>
              <span className="font-bold text-base uppercase flex justify-between">
                {message.author === currentUserId
                  ? 'you'
                  : users[message.author]?.name || message.author}
                <time className="font-normal text-white-50">{dateToTimeString(message.date)}</time>
              </span>
              {message.messageType === 'TEXT' && (
                <p className="text-sm break-words">{message.text}</p>
              )}
            </li>
          );
        })}
      </ul>
      <form>
        <div className="relative">
          <TextArea
            className="mb-0"
            name="chat"
            placeholder="Message..."
            onChange={handleMessageChange}
            onKeyUp={handleKeyUp}
            value={message}
          />
        </div>
      </form>
    </Panel>
  );
};

export default TextChatView;
