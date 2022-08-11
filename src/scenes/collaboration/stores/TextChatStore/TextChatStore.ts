import {cast, flow, types} from 'mobx-state-tree';
import AgoraRTM, {RtmChannel, RtmClient, RtmTextMessage} from 'agora-rtm-sdk';
import {t} from 'i18next';

import {RequestModel, ResetModel, UserProfileModelInterface} from 'core/models';
import {MessageInterface} from 'core/interfaces';
import {api, ProfileResponse} from 'api';
import {TextMessageEnum} from 'core/enums';

const TextChatStore = types.compose(
  ResetModel,
  types
    .model('TextChatStore', {
      currentUserId: '',
      users: types.maybeNull(types.frozen<{[key: string]: UserProfileModelInterface | null}>()),
      ids: types.maybeNull(types.frozen(Array<string>())),
      messages: types.optional(types.array(types.frozen<MessageInterface>()), []),
      numberOfUnreadMessages: types.maybe(types.number),
      numberOfReadMessages: types.maybe(types.number),
      members: types.maybeNull(types.frozen(Array<string>())),
      request: types.optional(RequestModel, {}),
      name: '',
      isLoggedOn: false,
      messageSent: false,
      tokenRequest: types.optional(RequestModel, {})
    })
    .volatile<{client: RtmClient | null}>(() => ({
      client: null
    }))
    .volatile<{currentChannel: RtmChannel | null}>(() => ({
      currentChannel: null
    }))
    .volatile<{messages2: Array<MessageInterface>}>(() => ({
      messages2: []
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
      fetchUser: flow(function* (userId: string) {
        const response: ProfileResponse = yield self.request.send(api.userRepository.fetchProfile, {
          userId
        });

        if (response) {
          self.name = response.name;
        }
      }),
      logOut: flow(function* () {
        if (self.client) {
          const response = yield self.client.logout();
          if (response) {
            console.info('[agora] AgoraRTM client logout success');
          }
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
          self.disableCurrentChannel();
          self.resetMessages();
          console.info('[agora] Left AgoraRTM channel successfully');
        }
      })
    }))
);

export {TextChatStore};
