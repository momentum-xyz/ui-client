import {flow, types} from 'mobx-state-tree';
import {StreamChat, Channel, Event} from 'stream-chat';

import {appVariables} from 'api/constants';
import {DialogModel, RequestModel, ResetModel, UserProfileModelInterface} from 'core/models';
import {MessageInterface} from 'core/interfaces';
import {api, ProfileResponse} from 'api';

const StreamChatStore = types.compose(
  ResetModel,
  types
    .model('StreamChatStore', {
      currentUserId: '',
      messages: types.optional(types.array(types.frozen<MessageInterface>()), []),
      numberOfUnreadMessages: 0,
      numberOfReadMessages: 0,
      request: types.optional(RequestModel, {}),
      name: '',
      messageSent: false,
      tokenRequest: types.optional(RequestModel, {}),
      textChatDialog: types.optional(DialogModel, {})
    })
    .volatile<{client: StreamChat | null}>(() => ({
      client: null
    }))
    .volatile<{currentChannel: Channel | null}>(() => ({
      currentChannel: null
    }))
    .actions((self) => ({
      getChannelToken: flow(function* (spaceId: string) {
        const tokenResponse = yield self.tokenRequest.send(
          api.streamChatRepository.getStreamChatToken,
          {spaceId}
        );
        return tokenResponse;
      }),
      leaveChannel: flow(function* (spaceId: string) {
        const leaveResponse = yield self.tokenRequest.send(api.streamChatRepository.leave, {
          spaceId
        });
        return leaveResponse;
      }),
      fetchUser: flow(function* (userId: string) {
        const response: ProfileResponse = yield self.request.send(api.userRepository.fetchProfile, {
          userId
        });

        if (response) {
          self.name = response.name;
        }
        return response;
      }),
      setCurrentUserId(currentUser: string) {
        self.currentUserId = currentUser;
      },
      setNumberOfUnreadMessages(unreadMessages: number) {
        self.numberOfUnreadMessages = unreadMessages;
      },
      setNumberOfReadMessages(readMessages: number) {
        self.numberOfReadMessages = readMessages;
      }
    }))
    .actions((self) => {
      const timeNow = new Date();
      return {
        init: flow(function* (
          userId: string,
          spaceId: string,
          profile?: UserProfileModelInterface
        ) {
          self.client = StreamChat.getInstance(appVariables.STREAMCHAT_KEY);
          const response = yield self.getChannelToken(spaceId);

          const userData = {
            id: userId,
            name: profile?.name,
            image: profile?.avatarSrc
          };
          console.log('StreamChatStore: connectUser: ', {userId, userProfile: profile, userData});
          yield self.client.connectUser(userData, response.token);
          self.setCurrentUserId(userId);
          self.currentChannel = self.client.channel(response.channel_type, response.channel);

          const refreshUnreadCount = (timeNow?: Date) => {
            self.setNumberOfUnreadMessages(self.currentChannel?.countUnread(timeNow) || 0);
          };
          refreshUnreadCount(timeNow);

          self.currentChannel.watch();
          const handleMsgEvent = (event: Event) => {
            console.log('StreamChatStore MSG event', event);
            console.log(
              'StreamChatStore currentChannel countUnread:',
              self.currentChannel?.countUnread(),
              'countUnread(timeNow):',
              self.currentChannel?.countUnread(timeNow)
            );
            // if (event.total_unread_count !== undefined) {
            //   self.setNumberOfUnreadMessages(event.total_unread_count);
            // }
            refreshUnreadCount();
          };
          self.currentChannel.on('message.new', handleMsgEvent);
          self.currentChannel.on('notification.mark_read', handleMsgEvent);
          self.currentChannel.on((event) => {
            console.log('StreamChatStore event', event);
            refreshUnreadCount();
          });
        }),
        deinit: flow(function* (spaceId?: string) {
          if (self.client) {
            // it breaks the app when we try to init in another space or world chat
            // this whole logic needs to be refactored and moved into Service
            // yield self.client.disconnectUser();

            if (spaceId) {
              self.currentChannel?.stopWatching();
              yield self.leaveChannel(spaceId);
            }
            self.client = null;
            self.currentChannel = null;
          }
        }),
        updateUser: flow(function* (userId: string, profile: UserProfileModelInterface) {
          if (!self.client) {
            console.log('StreamChatStore: updateUser: client is not initialized');
            return;
          }
          const userData = {
            id: userId,
            name: profile?.name,
            image: profile?.avatarSrc
          };
          console.log('StreamChatStore: updateUser: ', {userId, userProfile: profile, userData});
          try {
            // it updates the user in the stream chat system but it doesn't immediately propagates to all active users in the chat
            // they support sending custom_events that need to be enabled in the server for our channel type
            // that would perhaps broadcast the change to all users
            yield self.client.upsertUser(userData);
          } catch (err) {
            console.log('StreamChatStore: updateUser: error:', err);
          }
        })
      };
    })
    .views((self) => ({
      get isLoggedOn(): boolean {
        return !!self.client && !!self.currentChannel;
      }
    }))
);

export {StreamChatStore};
