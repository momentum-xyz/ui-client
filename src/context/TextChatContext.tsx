import React, {Dispatch, SetStateAction, useCallback, useContext, useEffect, useState} from 'react';
import AgoraRTM, {RtmChannel, RtmClient, RtmMessage} from 'agora-rtm-sdk';
import {observer} from 'mobx-react-lite';

import {request} from 'api/request';
import {appVariables} from 'api/constants';
import {useStore} from 'shared/hooks';

import {promiseFetch} from '../hooks/api/useApi';
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

  const {mainStore} = useStore();
  const {agoraStore} = mainStore;

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
          setMessages((messages) => [
            ...messages,
            {...message, author: currentUserId, date: new Date()}
          ]);
          console.info('[agora] Sent message successfully');
        })
        .catch((error) => {
          console.error('[agora] There was an error in sending message', error);
        });
    }
  };

  // TODO: Refactor to AgoraStore
  const joinChannel = useCallback(() => {
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
      console.info('[agora] Left AgoraRTM channel successfully');
    });
  }, [currentChannel, isLoggedIn]);

  // TODO: Refactor to AgoraStore
  useEffect(() => {
    if (!agoraStore.appId || !authState.user || chatClient) {
      return;
    }

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
        setCurrentUserId(authState.subject);
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
      client?.removeAllListeners();
    };
  }, [agoraStore.appId, authState.subject, authState.user, chatClient, isLoggedIn]);

  // TODO: Refactor to AgoraStore
  useEffect(() => {
    if (!isLoggedIn || !chatClient) {
      return;
    }

    if (agoraStore.hasJoined && !currentChannel) {
      joinChannel();
    } else if (!agoraStore.hasJoined && currentChannel) {
      leaveChannel();
    }
  }, [agoraStore.hasJoined, chatClient, currentChannel, isLoggedIn, joinChannel, leaveChannel]);

  // @ts-ignore: TODO: Refactor
  useEffect(() => {
    if (currentChannel) {
      currentChannel.on('ChannelMessage', (message, memberId) => {
        setMessages((messages) => [...messages, {...message, author: memberId, date: new Date()}]);
      });
      currentChannel.on('MemberJoined', (memberId) => {
        setMembers((members) => [...members, memberId]);
        promiseFetch<User>(appVariables.BACKEND_ENDPOINT_URL + `/users/profile/${memberId}`).then(
          (user) => {
            setMessages((messages) => [
              ...messages,
              {
                messageType: 'SYSTEM',
                text: `${user?.name || memberId} has joined the collaboration space`,
                author: 'SYSTEM',
                date: new Date()
              }
            ]);
          }
        );
      });
      currentChannel.on('MemberLeft', (memberId) => {
        promiseFetch<User>(appVariables.BACKEND_ENDPOINT_URL + `/users/profile/${memberId}`).then(
          (user) => {
            setMessages((messages) => [
              ...messages,
              {
                messageType: 'SYSTEM',
                text: `${user.name} has left the collaboration space`,
                author: 'SYSTEM',
                date: new Date()
              }
            ]);
          }
        );
      });
      return () => {
        currentChannel.removeAllListeners();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChannel]);

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
