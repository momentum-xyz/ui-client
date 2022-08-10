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
        self.client?.removeAllListeners();
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
      setMessages(message: any, userId: string) {
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
      joinChannel(spaceId: string) {
        if (self.client) {
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
          console.info('[agora] Left AgoraRTM channel successfully');
        });
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
      },
      fetchUser: flow(function* (userId: string) {
        const response: ProfileResponse = yield self.request.send(api.userRepository.fetchProfile, {
          userId
        });

        if (response) {
          self.name = response.name;
        }
      }),
      setUsers(ids: string[]) {
        self.users = ids.reduce((ac, a) => ({...ac, [a]: null}), {});
        const internalKeys = Object.keys(self.users);
        const toAdd = ids.filter((x) => !internalKeys.includes(x));
        const toRemove = internalKeys.filter((x) => !ids.includes(x));
        const newUsers = {...self.users};
        toRemove.map((x) => delete newUsers[x]);
        toAdd.map((x) => (newUsers[x] = null));

        Object.keys(newUsers).map(async (userId: string) => {
          await self.request.send(api.userRepository.fetchProfile, {
            userId
          });
        });
      },
      setIds(ids: string[]) {
        self.ids = ids;
      }
    }))
);

export {TextChatStore};
