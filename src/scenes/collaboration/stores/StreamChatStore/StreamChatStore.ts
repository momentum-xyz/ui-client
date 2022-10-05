import {flow, types} from 'mobx-state-tree';
import {StreamChat, Channel} from 'stream-chat';

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
    .actions((self) => ({
      init: flow(function* (userId: string, spaceId: string, profile?: UserProfileModelInterface) {
        self.client = StreamChat.getInstance(appVariables.STREAMCHAT_KEY);
        const response = yield self.getChannelToken(spaceId);
        yield self.client.connectUser(
          {
            id: userId,
            name: profile?.name,
            image: profile?.avatarSrc
          },
          response.token
        );
        self.setCurrentUserId(userId);
        self.currentChannel = self.client.channel(response.channel_type, response.channel);
      }),
      deinit: flow(function* (spaceId?: string) {
        if (self.client) {
          yield self.client.disconnectUser();
          if (spaceId) {
            yield self.leaveChannel(spaceId);
          }
          self.client = null;
          self.currentChannel = null;
        }
      })
    }))
    .views((self) => ({
      get isLoggedOn(): boolean {
        return !!self.client && !!self.currentChannel;
      }
    }))
);

export {StreamChatStore};
