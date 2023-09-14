import {cast, flow, types} from 'mobx-state-tree';
import AgoraRTC, {
  ConnectionState,
  IAgoraRTCRemoteUser,
  IMicrophoneAudioTrack
} from 'agora-rtc-sdk-ng';
import {Event3dEmitter, RequestModel, ResetModel} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {PluginIdEnum} from 'api/enums';
import {appVariables} from 'api/constants';
import {AgoraRemoteUser, AgoraRemoteUserInterface} from 'core/models';
import {api, AgoraTokenResponse, GetAllObjectUserAttributesForObjectResponse} from 'api';

import {VoiceChatUser} from './models';

const AgoraVoiceChatStore = types
  .compose(
    ResetModel,
    types.model('AgoraVoiceChatStore', {
      appId: '',
      hasJoined: false,
      userId: types.maybe(types.string),
      worldId: types.maybe(types.string),
      connectionState: types.optional(types.frozen<ConnectionState>(), 'DISCONNECTED'),
      localSoundLevel: 0,

      // FIXME: These arrays must be joined
      users: types.array(VoiceChatUser),
      agoraRemoteUsers: types.optional(types.array(AgoraRemoteUser), []),

      usersRequest: types.optional(RequestModel, {}),
      tokenRequest: types.optional(RequestModel, {}),
      joinRequest: types.optional(RequestModel, {}),
      leaveRequest: types.optional(RequestModel, {})
    })
  )
  .volatile(() => ({
    client: AgoraRTC.createClient({mode: 'rtc', codec: 'h264'})
  }))
  .actions((self) => ({
    initAgora(worldId: string, userId: string) {
      self.client.enableAudioVolumeIndicator();
      self.appId = appVariables.AGORA_APP_ID;
      self.worldId = worldId;
      self.userId = userId;
    },
    initUsers(worldId: string) {
      this.loadUsers(worldId);
      this.subscribeToPosBusUsers();
    },
    loadUsers: flow(function* (worldId: string) {
      const response: GetAllObjectUserAttributesForObjectResponse = yield self.usersRequest.send(
        api.objectUserAttributeRepository.getAllObjectUserAttributesForObject,
        {
          objectId: worldId,
          pluginId: PluginIdEnum.CORE,
          attributeName: AttributeNameEnum.VOICE_CHAT_USER
        }
      );

      if (response) {
        const joinedUsers = Object.entries(response).filter(([_, user]) => user.joined);
        self.users = cast(joinedUsers.map(([userId]) => VoiceChatUser.create({id: userId})));
      }
    }),
    handleAddUser(userId: string) {
      if (!self.users.find((user) => user.id === userId)) {
        const user = VoiceChatUser.create({id: userId});
        self.users = cast([...self.users, user]);
      }
    },
    handleRemoveUser(userId: string) {
      self.users = cast(self.users.filter((user) => user.id !== userId));
    },
    subscribeToPosBusUsers() {
      Event3dEmitter.on('UserJoinedVoiceChat', this.handleAddUser);
      Event3dEmitter.on('UserLeftVoiceChat', this.handleRemoveUser);
    },
    beforeDestroy() {
      Event3dEmitter.off('UserJoinedVoiceChat', this.handleAddUser);
      Event3dEmitter.off('UserLeftVoiceChat', this.handleRemoveUser);
    }
  }))
  .actions((self) => ({
    handleUserPublished: flow(function* (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') {
      yield self.client.subscribe(user, mediaType);

      if (mediaType === 'audio') {
        user.audioTrack?.play();
      }

      const updatedUser = self.agoraRemoteUsers.find((remoteUser) => remoteUser.uid === user.uid);
      if (updatedUser) {
        updatedUser.agoraRTCUser = user;

        if (mediaType === 'audio') {
          updatedUser.setIsMuted(!user.hasAudio);
          updatedUser.audioTrack = user.audioTrack;
        }
      }
    }),
    handleUserUnpublished(user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') {
      const foundUser = self.agoraRemoteUsers.find((remoteUser) => remoteUser.uid === user.uid);

      if (foundUser?.agoraRTCUser) {
        if (mediaType === 'audio' && foundUser.audioTrack?.isPlaying) {
          foundUser.audioTrack?.stop();
        }

        if (mediaType === 'audio') {
          foundUser.setIsMuted(true);
        }
      }
    },
    handleAgoraRemoteUserJoined(user: IAgoraRTCRemoteUser) {
      if (String(user?.uid).split('|')[0] === 'ss') {
        return;
      }

      if (!self.agoraRemoteUsers.find((remoteUser) => remoteUser.uid === user.uid)) {
        const newUser: AgoraRemoteUserInterface = cast({
          uid: user.uid,
          agoraRTCUser: user,
          isMuted: true
        });

        self.agoraRemoteUsers = cast([...self.agoraRemoteUsers, newUser]);
      }
    },
    handleAgoraRemoteUserLeft(user: IAgoraRTCRemoteUser) {
      if (String(user?.uid).split('|')[0] === 'ss') {
        return;
      }

      self.agoraRemoteUsers = cast(self.agoraRemoteUsers.filter((u) => u.uid !== user.uid));
    },
    handleConnectionStateChange(state: ConnectionState) {
      self.connectionState = state;
    },
    handleVolumeIndicator(users: {uid: string; level: number}[]) {
      const currentUser = users.find((user) => user.uid === self.userId);
      self.localSoundLevel = currentUser?.level ?? 0;

      self.agoraRemoteUsers.forEach((remoteUser) => {
        const user = users.find((user) => remoteUser.uid === user.uid);
        remoteUser.setSoundLevel(user?.level ?? 0);
      });
    },
    setupAgoraListeners() {
      self.client.on('user-published', this.handleUserPublished);
      self.client.on('user-unpublished', this.handleUserUnpublished);
      self.client.on('user-joined', this.handleAgoraRemoteUserJoined);
      self.client.on('user-left', this.handleAgoraRemoteUserLeft);
      self.client.on('connection-state-change', this.handleConnectionStateChange);
      self.client.on('volume-indicator', this.handleVolumeIndicator);
    },
    cleanupListeners() {
      self.client.removeAllListeners();
    }
  }))
  .actions((self) => ({
    createAudioTrackAndPublish: flow(function* (deviceId: string, isTrackEnabled: boolean) {
      if (self.client.connectionState !== 'CONNECTED') {
        return undefined;
      }

      const publishedAudioTrack: IMicrophoneAudioTrack = yield AgoraRTC.createMicrophoneAudioTrack({
        microphoneId: deviceId
      });

      yield self.client.publish(publishedAudioTrack);
      yield publishedAudioTrack.setEnabled(isTrackEnabled);

      return publishedAudioTrack;
    })
  }))
  .actions((self) => ({
    join: flow(function* () {
      if (!self.worldId || !self.userId || self.hasJoined) {
        return false;
      }

      const tokenResponse: AgoraTokenResponse = yield self.tokenRequest.send(
        api.agoraRepository.getAgoraToken,
        {spaceId: self.worldId}
      );

      yield self.client.join(self.appId, tokenResponse.channel, tokenResponse.token, self.userId);
      self.hasJoined = true;

      yield self.joinRequest.send(api.objectUserAttributeRepository.setObjectUserAttribute, {
        objectId: self.worldId,
        userId: self.userId,
        pluginId: PluginIdEnum.CORE,
        attributeName: AttributeNameEnum.VOICE_CHAT_USER,
        value: {userId: self.userId, joined: true}
      });

      return true;
    }),
    leave: flow(function* () {
      if (!self.userId || !self.worldId) {
        return;
      }

      yield self.leaveRequest.send(api.objectUserAttributeRepository.setObjectUserAttribute, {
        objectId: self.worldId,
        userId: self.userId,
        pluginId: PluginIdEnum.CORE,
        attributeName: AttributeNameEnum.VOICE_CHAT_USER,
        value: {userId: self.userId, joined: false}
      });

      if (self.hasJoined) {
        yield self.client.leave();
        self.agoraRemoteUsers = cast([]);
        self.hasJoined = false;
      }
    })
  }))
  .views((self) => ({
    get joinedUsers() {
      return self.users
        .filter((user) => user.id !== self.userId)
        .map((user) => {
          const userState = [...self.agoraRemoteUsers].find((au) => au.uid === user.id);
          return {
            id: user.id,
            name: user.name,
            image: user.avatarHash,
            isMuted: userState ? userState.isMuted : true,
            soundLevel: userState?.soundLevel || 0
          };
        });
    }
  }));

export {AgoraVoiceChatStore};
