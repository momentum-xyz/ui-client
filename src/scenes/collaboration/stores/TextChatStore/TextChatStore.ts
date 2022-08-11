import {cast, flow, types} from 'mobx-state-tree';
import AgoraRTM, {RtmChannel, RtmClient, RtmMessage, RtmTextMessage} from 'agora-rtm-sdk';
import {t} from 'i18next';

import {DialogModel, RequestModel, ResetModel} from 'core/models';
import {MessageInterface} from 'core/interfaces';
import {api, ProfileResponse} from 'api';
import {TextMessageEnum} from 'core/enums';

const TextChatStore = types.compose(
  ResetModel,
  types
    .model('TextChatStore', {
      currentUserId: '',
      messages: types.optional(types.array(types.frozen<MessageInterface>()), []),
      numberOfUnreadMessages: 0,
      numberOfReadMessages: 0,
      request: types.optional(RequestModel, {}),
      name: '',
      isLoggedOn: false,
      messageSent: false,
      tokenRequest: types.optional(RequestModel, {}),
      textChatDialog: types.optional(DialogModel, {})
    })
    .volatile<{client: RtmClient | null}>(() => ({
      client: null
    }))
    .volatile<{currentChannel: RtmChannel | null}>(() => ({
      currentChannel: null
    }))
    .actions((self) => ({
      getAgoraToken: flow(function* () {
        const tokenResponse: string = yield self.tokenRequest.send(
          api.textChatRepository.getTextChatToken
        );

        return tokenResponse;
      }),
      setLogin(login: boolean) {
        self.isLoggedOn = login;
      },
      setCurrentUserId(currentUser: string) {
        self.currentUserId = currentUser;
      },
      setMessages(message: RtmTextMessage, userId: string) {
        if (message) {
          self.messages = cast([
            ...self.messages,
            {
              ...message,
              author: userId,
              date: new Date(),
              name: userId === self.currentUserId ? t('textMessage.you') : self.name
            }
          ]);
          this.setMessageSent();
        }
      },
      joinSystemMessages(message?: RtmTextMessage) {
        self.messages = cast([
          ...self.messages,
          {
            ...message,
            messageType: TextMessageEnum.SYSTEM,
            text: t('textMessage.joinText', {
              name: self.name
            }),
            author: TextMessageEnum.SYSTEM,
            name: self.name,
            date: new Date()
          }
        ]);
        this.setMessageSent();
      },
      leftSystemMessages(message?: RtmTextMessage) {
        self.messages = cast([
          ...self.messages,
          {
            ...message,
            messageType: TextMessageEnum.SYSTEM,
            text: t('textMessage.leftText', {
              name: self.name
            }),
            author: TextMessageEnum.SYSTEM,
            name: self.name,
            date: new Date()
          }
        ]);
        this.setMessageSent();
      },
      setMessageSent() {
        self.messageSent = !self.messageSent;
      },
      resetMessages() {
        self.messages.length = 0;
      },
      disableCurrentChannel() {
        self.currentChannel = null;
      },
      setNumberOfUnreadMessages(unreadMessages: number) {
        self.numberOfUnreadMessages = unreadMessages;
      },
      setNumberOfReadMessages(readMessages: number) {
        self.numberOfReadMessages = readMessages;
      }
    }))
    .actions((self) => ({
      fetchUser: flow(function* (userId: string) {
        const response: ProfileResponse = yield self.request.send(api.userRepository.fetchProfile, {
          userId
        });

        if (response) {
          self.name = response.name;
        }
      })
    }))
    .actions((self) => ({
      init: flow(function* () {}),
      handleUserSendMessage: flow(function* (text: RtmMessage, memberId: string) {
        yield self.fetchUser(memberId);
        self.setMessages(text as RtmTextMessage, memberId);
      }),
      handleUserJoin: flow(function* (memberId: string) {
        yield self.fetchUser(memberId);
        self.joinSystemMessages();
      }),
      handleUserLeave: flow(function* (memberId: string) {
        yield self.fetchUser(memberId);
        self.leftSystemMessages();
      })
    }))
    .actions((self) => ({
      login: flow(function* (appId: string, userId: string) {
        self.client = AgoraRTM.createInstance(appId);
        self.client.on('ConnectionStateChanged', (newState, reason) => {
          console.info('[agora] on connection state changed to ' + newState + ' reason: ' + reason);
        });
        console.info('[agora] AgoraRTM logging in...');
        const token = yield self.getAgoraToken();
        yield self.client.login({
          token: token,
          uid: userId
        });
        self.setCurrentUserId(userId);
        self.setLogin(true);
      }),
      logOut: flow(function* () {
        if (self.client) {
          yield self.client.logout();
          console.info('[agora] AgoraRTM client logout success');
        }
      }),
      sendMessage: flow(function* (message: RtmTextMessage) {
        if (self.currentChannel && self.currentUserId) {
          yield self.currentChannel.sendMessage(message);
          self.setMessages(message, self.currentUserId);
          console.info('[agora] Sent message successfully');
        }
      }),
      joinChannel: flow(function* (spaceId: string) {
        if (self.client) {
          self.currentChannel = self.client.createChannel(spaceId);

          self.currentChannel.on('ChannelMessage', self.handleUserSendMessage);
          self.currentChannel.on('MemberJoined', self.handleUserJoin);
          self.currentChannel.on('MemberLeft', self.handleUserLeave);

          const response = yield self.currentChannel.join();
          if (response) {
            console.info('[agora] Joined AgoraRTM channel successfully');
          }
        }
      }),
      leaveChannel: flow(function* () {
        console.info('[agora] Leaving AgoraRTM channel');
        if (self.currentChannel) {
          yield self.currentChannel.leave();
          self.currentChannel.removeAllListeners();
          self.setLogin(false);
          self.disableCurrentChannel();
          self.resetMessages();
          console.info('[agora] Left AgoraRTM channel successfully');
        }
      }),
      countUnreadMessages() {
        const numberOfMessagesOfOtherUsers = self.messages.filter(
          (item) =>
            item.messageType !== TextMessageEnum.SYSTEM && item.author !== self.currentUserId
        ).length;
        if (self.textChatDialog.isOpen) {
          self.setNumberOfReadMessages(numberOfMessagesOfOtherUsers);
          self.setNumberOfUnreadMessages(0);
        } else {
          self.setNumberOfUnreadMessages(numberOfMessagesOfOtherUsers - self.numberOfReadMessages);
        }
      }
    }))
    .actions((self) => ({
      init: flow(function* (appId: string, userId: string, spaceId: string) {
        yield self.login(appId, userId);
        yield self.joinChannel(spaceId);
      })
    }))
);

export {TextChatStore};
