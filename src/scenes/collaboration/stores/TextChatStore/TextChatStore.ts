import {cast, flow, types} from 'mobx-state-tree';
import AgoraRTM, {RtmChannel, RtmClient, RtmTextMessage} from 'agora-rtm-sdk';

import {RequestModel, ResetModel, UserProfileModelInterface} from 'core/models';
import {MessageInterface} from 'core/interfaces';
import {appVariables} from 'api/constants';
import {api, ProfileResponse} from 'api';
import {request} from 'api/request';

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
      isLoggedOn: false
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
      initClient(appId: string, userId: string) {
        self.client = AgoraRTM.createInstance(appId);

        self.client.on('ConnectionStateChanged', (newState, reason) => {
          console.info('[agora] on connection state changed to ' + newState + ' reason: ' + reason);
        });

        console.info('[agora] AgoraRTM logging in...');

        request
          .get(appVariables.BACKEND_ENDPOINT_URL + `/agora/token`)
          .then((response) => {
            return self.client?.login({
              token: response.data,
              uid: userId
            });
          })
          .then(() => {
            this.setCurrentUserId(userId);
            this.setLogin(true);
            console.info('[agora] AgoraRTM client login success');
          })
          .catch((error) => {
            console.error('[agora] AgoraRTM client login error', error);
          });
      },
      fetchUser: flow(function* (userId: string) {
        const response: ProfileResponse = yield self.request.send(api.userRepository.fetchProfile, {
          userId
        });

        if (response) {
          self.name = response.name;
        }
      }),
      setLogin(login: boolean) {
        self.isLoggedOn = login;
      },
      logOut() {
        self.client
          ?.logout()
          .then(() => {
            console.info('[agora] AgoraRTM client logout success');
          })
          .catch((error) => {
            console.error('[agora] AgoraRTM client logout error', error);
          });
      },
      sendMessage(message: RtmTextMessage) {
        if (self.currentChannel && self.currentUserId) {
          self.currentChannel
            .sendMessage(message)
            .then(() => {
              this.setMessages(message, self.currentUserId);
              console.info('[agora] Sent message successfully');
            })
            .catch((error) => {
              console.error('[agora] There was an error in sending message', error);
            });
        }
      },
      setMessages(message: RtmTextMessage, userId: string) {
        if (message) {
          self.messages = cast([
            ...self.messages,
            {
              ...message,
              author: userId,
              date: new Date(),
              name: userId === self.currentUserId ? 'you' : self.name
            }
          ]);
        }
      },
      joinSystemMessages(message?: RtmTextMessage) {
        self.messages = cast([
          ...self.messages,
          {
            ...message,
            messageType: 'SYSTEM',
            text: `${self.name} has joined the collaboration space`,
            author: 'SYSTEM',
            name: self.name,
            date: new Date()
          }
        ]);
      },
      leftSystemMessages(message?: RtmTextMessage) {
        self.messages = cast([
          ...self.messages,
          {
            ...message,
            messageType: 'SYSTEM',
            text: `${self.name} has left the collaboration space`,
            author: 'SYSTEM',
            name: self.name,
            date: new Date()
          }
        ]);
      },
      joinChannel(spaceId: string) {
        if (self.client) {
          console.info('new client?');

          self.currentChannel = self.client.createChannel(spaceId);
          self.currentChannel
            .join()
            .then(() => {
              if (self.currentChannel) {
                self.currentChannel.getMembers().then((members) => {});
              }
              console.info('[agora] Joined AgoraRTM channel successfully');
            })
            .catch((error) => {
              console.error('[agora] AgoraRTM channel failed to connect to meeting channel', error);
            });
        }
      },
      leaveChannel() {
        console.info('[agora] Leaving AgoraRTM channel');
        self.currentChannel?.leave().then(() => {
          this.disableCurrentChannel();
          this.resetMessages();
          console.info('[agora] Left AgoraRTM channel successfully');
        });
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
      },
      setCurrentUserId(currentUser: string) {
        self.currentUserId = currentUser;
      }
    }))
);

export {TextChatStore};
