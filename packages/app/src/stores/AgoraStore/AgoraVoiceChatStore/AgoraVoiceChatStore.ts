import {cast, flow, types} from 'mobx-state-tree';
import AgoraRTC, {
  ConnectionDisconnectedReason,
  ConnectionState,
  IAgoraRTCRemoteUser,
  IMicrophoneAudioTrack
} from 'agora-rtc-sdk-ng';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {AgoraTokenResponse, api, GetAllSpaceUserAttributesForSpaceResponse} from 'api';
import {appVariables} from 'api/constants';
import {AgoraRemoteUser, AgoraRemoteUserInterface} from 'core/models';
import {AgoraScreenShareStoreType} from 'stores/AgoraStore/AgoraScreenShareStore';
import {PluginIdEnum, VoiceChatActionEnum} from 'api/enums';
import {VoiceChatUserAttributeInterface} from 'api/interfaces';

import {VoiceChatUser} from './models';

const AgoraVoiceChatStore = types
  .compose(
    ResetModel,
    types.model('AgoraVoiceChatStore', {
      appId: '',
      userId: types.maybe(types.string),
      worldId: types.maybe(types.string),
      users: types.array(VoiceChatUser),
      _agoraRemoteUsers: types.optional(types.array(AgoraRemoteUser), []),
      connectionState: types.optional(types.frozen<ConnectionState>(), 'DISCONNECTED'),
      localSoundLevel: 0,
      hasJoined: false,

      tokenRequest: types.optional(RequestModel, {}),
      joinRequest: types.optional(RequestModel, {}),
      leaveRequest: types.optional(RequestModel, {}),
      kickRequest: types.optional(RequestModel, {}),
      muteRequest: types.optional(RequestModel, {}),
      usersRequest: types.optional(RequestModel, {})
    })
  )
  .volatile(() => ({
    client: AgoraRTC.createClient({mode: 'rtc', codec: 'h264'})
  }))
  .views((self) => ({
    get agoraRemoteUsers(): AgoraRemoteUserInterface[] {
      return self._agoraRemoteUsers;
    },
    set agoraRemoteUsers(users: AgoraRemoteUserInterface[]) {
      self._agoraRemoteUsers = cast(users);
    }
  }))
  // Listeners handlers
  .actions((self) => ({
    handleUserPublished: flow(function* (
      screenShareStore: AgoraScreenShareStoreType,
      user: IAgoraRTCRemoteUser,
      mediaType: 'audio' | 'video'
    ) {
      yield self.client.subscribe(user, mediaType);

      if (mediaType === 'audio') {
        user.audioTrack?.play();
      }

      const updatedUser = self.agoraRemoteUsers.find((remoteUser) => remoteUser.uid === user.uid);

      if (updatedUser) {
        updatedUser.participantInfo = user;
        if (mediaType === 'audio') {
          updatedUser.isMuted = !user.hasAudio;
          updatedUser.audioTrack = user.audioTrack;
        }
      }
    }),
    handleUserUnpublished(
      screenShareStore: AgoraScreenShareStoreType,
      user: IAgoraRTCRemoteUser,
      mediaType: 'audio' | 'video'
    ) {
      const foundUser = self.agoraRemoteUsers.find((remoteUser) => remoteUser.uid === user.uid);

      if (foundUser?.participantInfo) {
        if (mediaType === 'audio' && foundUser.audioTrack?.isPlaying) {
          foundUser.audioTrack?.stop();
        }

        if (mediaType === 'audio') {
          foundUser.isMuted = true;
        }
      }
    },
    handleAgoraRemoteUserJoined(user: IAgoraRTCRemoteUser) {
      if (String(user?.uid).split('|')[0] === 'ss') {
        return;
      }

      const foundUser = self.agoraRemoteUsers.find((remoteUser) => remoteUser.uid === user.uid);

      const newUser: AgoraRemoteUserInterface = cast({
        uid: user.uid,
        participantInfo: user,
        isMuted: true,
        cameraOff: true
      });

      if (!foundUser) {
        self.agoraRemoteUsers = [...self.agoraRemoteUsers, newUser];
      }
    },
    handleAgoraRemoteUserLeft(user: IAgoraRTCRemoteUser) {
      if (String(user?.uid).split('|')[0] === 'ss') {
        return;
      }

      self.agoraRemoteUsers = self.agoraRemoteUsers.filter(
        (remoteUser) => remoteUser.uid !== user.uid
      );
    },
    handleConnectionStateChange(
      currentState: ConnectionState,
      previousState: ConnectionState,
      reason?: ConnectionDisconnectedReason
    ) {
      self.connectionState = currentState;
    },
    handleVolumeIndicator(users: {uid: string; level: number}[]) {
      const currentUser = users.find((user) => user.uid === self.userId);

      self.localSoundLevel = currentUser?.level ?? 0;

      self.agoraRemoteUsers.forEach((remoteUser) => {
        const user = users.find((user) => remoteUser.uid === user.uid);
        remoteUser.soundLevel = user?.level ?? 0;
      });
    }
  }))
  // Listeners registration
  .actions((self) => ({
    setupAgoraListeners(screenShareStore: AgoraScreenShareStoreType) {
      self.client.on('user-published', (user, mediaType) =>
        self.handleUserPublished(screenShareStore, user, mediaType)
      );
      self.client.on('user-unpublished', (user, mediaType) =>
        self.handleUserUnpublished(screenShareStore, user, mediaType)
      );
      self.client.on('user-joined', self.handleAgoraRemoteUserJoined);
      self.client.on('user-left', self.handleAgoraRemoteUserLeft);
      self.client.on('connection-state-change', self.handleConnectionStateChange);
      self.client.on('volume-indicator', self.handleVolumeIndicator);
    },
    cleanupListeners() {
      self.client.removeAllListeners();
    }
  }))
  // Common actions
  .actions((self) => ({
    init: flow(function* (worldId: string, userId: string) {
      self.client.enableAudioVolumeIndicator();
      self.appId = appVariables.AGORA_APP_ID;
      self.worldId = worldId;
      self.userId = userId;

      const response: GetAllSpaceUserAttributesForSpaceResponse | undefined =
        yield self.usersRequest.send(
          api.spaceUserAttributeRepository.getAllSpaceUserAttributesForSpace,
          {
            spaceId: worldId,
            pluginId: PluginIdEnum.CORE,
            attributeName: AttributeNameEnum.VOICE_CHAT_USER
          }
        );

      if (response) {
        self.users = cast(
          Object.entries(response)
            .filter(([_, user]) => user.joined)
            .map(([userId, _]) => VoiceChatUser.create({id: userId}))
        );
      }
    }),
    createAudioTrackAndPublish: flow(function* (deviceId: string, isTrackEnabled: boolean) {
      if (self.client.connectionState !== 'CONNECTED') {
        return undefined;
      }

      const publishedAudioTrack: IMicrophoneAudioTrack = yield AgoraRTC.createMicrophoneAudioTrack({
        microphoneId: deviceId
      });

      yield self.client.publish(publishedAudioTrack);
      publishedAudioTrack.setEnabled(isTrackEnabled);

      return publishedAudioTrack;
    }),
    getAgoraToken: flow(function* (spaceId?: string) {
      if (!spaceId) {
        return undefined;
      }

      const tokenResponse: AgoraTokenResponse = yield self.tokenRequest.send(
        api.agoraRepository.getAgoraToken,
        {
          spaceId: spaceId ?? self.worldId
        }
      );

      return tokenResponse;
    })
  }))
  // State actions
  .actions((self) => ({
    join: flow(function* (
      createLocalTracks: (
        createAudioTrack: (
          deviceId: string,
          isTrackEnabled: boolean
        ) => Promise<IMicrophoneAudioTrack | undefined>
      ) => Promise<void>
    ) {
      if (!self.worldId || !self.userId) {
        return;
      }

      const tokenResponse: AgoraTokenResponse = yield self.getAgoraToken(self.worldId);

      if (!tokenResponse) {
        return;
      }

      yield self.client.join(self.appId, tokenResponse.channel, tokenResponse.token, self.userId);

      self.hasJoined = true;

      const attributeValue: VoiceChatUserAttributeInterface = {
        userId: self.userId,
        joined: true
      };

      yield self.joinRequest.send(api.spaceUserAttributeRepository.setSpaceUserAttribute, {
        spaceId: self.worldId,
        userId: self.userId,
        pluginId: PluginIdEnum.CORE,
        attributeName: AttributeNameEnum.VOICE_CHAT_USER,
        value: attributeValue
      });

      yield createLocalTracks(self.createAudioTrackAndPublish);
      self.agoraRemoteUsers = self.client.remoteUsers
        .filter((user) => String(user.uid).split('|')[0] !== 'ss')
        .map((user) =>
          cast({
            uid: user.uid,
            participantInfo: user,
            isMuted: !user.hasAudio,
            cameraOff: true
          })
        );
    }),
    leave: flow(function* () {
      if (!self.userId || !self.worldId) {
        return;
      }

      const attributeValue: VoiceChatUserAttributeInterface = {
        userId: self.userId,
        joined: false
      };

      yield self.leaveRequest.send(api.spaceUserAttributeRepository.setSpaceUserAttribute, {
        spaceId: self.worldId,
        userId: self.userId,
        pluginId: PluginIdEnum.CORE,
        attributeName: AttributeNameEnum.VOICE_CHAT_USER,
        value: attributeValue
      });

      yield self.client.leave();
      self.agoraRemoteUsers = [];
      self.hasJoined = false;
    }),
    kickUser: flow(function* (userId: string) {
      console.info('[AgoraVoiceChatStore] Kicking user...', userId, self.worldId);
      if (!self.worldId) {
        return;
      }

      yield self.kickRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
        spaceId: self.worldId,
        plugin_id: PluginIdEnum.CORE,
        attribute_name: AttributeNameEnum.VOICE_CHAT_ACTION,
        value: {
          action: VoiceChatActionEnum.KICK,
          userId: userId
        }
      });
    }),
    muteUser: flow(function* (userId: string) {
      console.info('[AgoraVoiceChatStore] Muting user...', userId, self.worldId);
      if (!self.worldId) {
        return;
      }

      yield self.kickRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
        spaceId: self.worldId,
        plugin_id: PluginIdEnum.CORE,
        attribute_name: AttributeNameEnum.VOICE_CHAT_ACTION,
        value: {
          action: VoiceChatActionEnum.MUTE,
          userId: userId
        }
      });
    })
  }))
  .actions((self) => ({
    handleUserJoined(userId: string) {
      if (userId === self.userId) {
        return;
      }

      if (self.users.find((user) => user.id === userId)) {
        return;
      }

      const user = VoiceChatUser.create({id: userId});
      user.fetchUser();

      self.users = cast([...self.users, user]);
    },
    handleUserLeft(userId: string) {
      if (userId === self.userId) {
        return;
      }
      self.users = cast(self.users.filter((user) => user.id !== userId));
    },
    handleUserKicked(userId: string) {
      if (userId === self.userId) {
        self.leave();
      }
    },
    handleUserMuted(userId: string, mute: () => void) {
      if (userId === self.userId) {
        mute();
      }
    },
    getAgoraRemoteUser(userId: string): AgoraRemoteUserInterface | undefined {
      return self.agoraRemoteUsers.find((user) => user.uid === userId);
    }
  }))
  .views((self) => ({
    get maxVideoStreamsReached(): boolean {
      return self.agoraRemoteUsers.length + 1 > appVariables.PARTICIPANTS_VIDEO_LIMIT;
    }
  }));

export {AgoraVoiceChatStore};
