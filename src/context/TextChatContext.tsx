import React, {Dispatch, SetStateAction, useCallback, useContext, useEffect, useState} from 'react';
import AgoraRTM, {RtmChannel, RtmClient, RtmMessage, RtmTextMessage} from 'agora-rtm-sdk';
import {observer} from 'mobx-react-lite';

import {request} from 'api/request';
import {appVariables} from 'api/constants';
import {useStore} from 'shared/hooks';

import {useUserList} from '../hooks/api/useUser';

import useContextAuth from './Auth/hooks/useContextAuth';
import User from './type/User';

interface TextChatContextInterface {
  chatClient: RtmClient | null;
  currentUserId?: string;
  users: {[key: string]: User | null};
  currentChannel: RtmChannel | null;
  messages: Message[];
  numberOfUnreadMessages: number;
  setNumberOfUnreadMessages: Dispatch<SetStateAction<number>>;
  numberOfReadMessages: number;
  setNumberOfReadMessages: Dispatch<SetStateAction<number>>;
  sendMessage: (message: RtmMessage) => void;
}

type SystemMessage = {
  text: string;
  messageType?: 'SYSTEM';
  /** @hidden */
  rawMessage?: never;
  /** @hidden */
  description?: never;
};

export type extendedMessage = RtmMessage | SystemMessage;

export type Message = extendedMessage & {
  author: string;
  date: Date;
  name: string;
};

const TextChatContext = React.createContext<TextChatContextInterface>({
  chatClient: null,
  currentChannel: null,
  messages: [],
  users: {},
  numberOfUnreadMessages: 0,
  setNumberOfUnreadMessages: () => {},
  numberOfReadMessages: 0,
  setNumberOfReadMessages: () => {},
  sendMessage: () => {}
});

export const useTextChatContext = () => useContext(TextChatContext);

const TextChatProviderComponent: React.FC = ({children}) => {
  const [chatClient, setChatClient] = useState<RtmClient | null>(null);

  const [currentUserId, setCurrentUserId] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [numberOfUnreadMessages, setNumberOfUnreadMessages] = useState<number>(0);
  const [numberOfReadMessages, setNumberOfReadMessages] = useState(0);
  const [currentChannel, setCurrentChannel] = useState<RtmChannel | null>(null);
  const [members, setMembers] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, updateMembers] = useUserList(members);

  const {mainStore, collaborationStore, sessionStore} = useStore();
  const {agoraStore} = mainStore;
  const {textChatStore} = collaborationStore;
  const {authState} = useContextAuth();

  useEffect(() => {
    updateMembers(members);
  }, [members, updateMembers]);

  // TODO: Refactor to AgoraStore
  const sendMessage = (message: RtmMessage) => {
    if (currentChannel && currentUserId) {
      currentChannel
        .sendMessage(message)
        .then(() => {
          textChatStore.setMessages(message as RtmTextMessage, sessionStore.userId);
          // setMessages((messages) => [
          //   ...messages,
          //   {
          //     ...message,
          //     author: sessionStore.userId,
          //     name: sessionStore.profile?.name ?? '',
          //     date: new Date()
          //   }
          // ]);
          console.info('[agora] Sent message successfully');
        })
        .catch((error) => {
          console.error('[agora] There was an error in sending message', error);
        });
    }
  };

  // TODO: Refactor to AgoraStore
  const joinChannel = useCallback(() => {
    console.info('chatClient,chatClien', chatClient);
    if (!agoraStore.spaceId || !chatClient) {
      return;
    }
    setMembers([]);
    setMessages([]);
    console.info('[agora] Creating channel...');
    const channel = chatClient.createChannel(agoraStore.spaceId);

    channel
      .join()
      .then(() => {
        setCurrentChannel(channel);

        channel.getMembers().then(setMembers);

        console.info('[agora] Joined AgoraRTM channel successfully');
      })
      .catch((error) => {
        console.error('[agora] AgoraRTM channel failed to connect to meeting channel', error);
      });
  }, [agoraStore.spaceId, chatClient]);

  // TODO: Refactor to AgoraStore
  const leaveChannel = useCallback(() => {
    if (!isLoggedIn) {
      return;
    }

    console.info('[agora] Leaving AgoraRTM channel');
    currentChannel?.leave().then(() => {
      setCurrentChannel(null);
      textChatStore.resetModel();

      console.info('[agora] Left AgoraRTM channel successfully');
    });
  }, [currentChannel, isLoggedIn]);

  // TODO: Refactor to AgoraStore
  useEffect(() => {
    console.info('when we are here?');
    if (!agoraStore.appId || !authState.user || chatClient) {
      return;
    }
    console.info('APP ID AGORA', agoraStore.appId);
    const client = AgoraRTM.createInstance(agoraStore.appId);
    setChatClient(client);

    client.on('ConnectionStateChanged', (newState, reason) => {
      console.info('[agora] on connection state changed to ' + newState + ' reason: ' + reason);
    });

    console.info('[agora] AgoraRTM logging in...');
    request
      .get(appVariables.BACKEND_ENDPOINT_URL + `/agora/token`)
      .then((response) => {
        return client.login({
          token: response.data,
          uid: authState.subject || ''
        });
      })
      .then(() => {
        setChatClient(client);
        setCurrentUserId(sessionStore.userId);
        console.info();
        setIsLoggedIn(true);
        console.info('[agora] AgoraRTM client login success');
      })
      .catch((error) => {
        console.error('[agora] AgoraRTM client login error', error);
      });

    return () => {
      if (!isLoggedIn) {
        return;
      }
      console.info('[agora] Cleaning up AgoraRTM client');
      client
        ?.logout()
        .then(() => {
          setIsLoggedIn(false);
          console.info('[agora] AgoraRTM client logout success');
        })
        .catch((error) => {
          console.error('[agora] AgoraRTM client logout error', error);
        });
      console.info('logout agora here?');

      client?.removeAllListeners();
    };
  }, [agoraStore.appId, authState.subject, authState.user, chatClient, isLoggedIn]);

  // TODO: Refactor to AgoraStore
  useEffect(() => {
    console.info('agora state???', agoraStore.hasJoined);
    if (!isLoggedIn || !chatClient) {
      return;
    }
    return;
    console.info(chatClient);
    if (agoraStore.hasJoined && !currentChannel) {
      console.info('when to join');
      joinChannel();
    } else if (!agoraStore.hasJoined && currentChannel) {
      console.info('when to leave');
      leaveChannel();
    }
  }, [agoraStore.hasJoined, chatClient, currentChannel, isLoggedIn, joinChannel, leaveChannel]);

  // @ts-ignore: TODO: Refactor
  useEffect(() => {
    if (currentChannel) {
      return;
      currentChannel?.on('ChannelMessage', async (message, memberId) => {
        await textChatStore.fetchUser(memberId);
        textChatStore.setMessages(message as RtmTextMessage, memberId);
      });
      currentChannel?.on('MemberJoined', async (memberId) => {
        await textChatStore.fetchUser(memberId);
        setMessages((messages) => [
          ...messages,
          {
            messageType: 'SYSTEM',
            text: `${textChatStore.name} has joined the collaboration space`,
            author: 'SYSTEM',
            name: textChatStore.name,
            date: new Date()
          }
        ]);
      });
      currentChannel?.on('MemberLeft', async (memberId) => {
        await textChatStore.fetchUser(memberId);

        setMessages((messages) => [
          ...messages,
          {
            messageType: 'SYSTEM',
            text: `${textChatStore.name} has left the collaboration space`,
            author: 'SYSTEM',
            name: textChatStore.name,
            date: new Date()
          }
        ]);
      });
      return () => {
        currentChannel?.removeAllListeners();
      };
    }
  }, [currentChannel, textChatStore]);

  return (
    <TextChatContext.Provider
      value={{
        chatClient,
        messages,
        users,
        currentChannel,
        sendMessage,
        numberOfUnreadMessages,
        setNumberOfUnreadMessages,
        numberOfReadMessages,
        setNumberOfReadMessages,
        currentUserId
      }}
    >
      {children}
    </TextChatContext.Provider>
  );
};

export const TextChatProvider = observer(TextChatProviderComponent);
export default TextChatContext;
