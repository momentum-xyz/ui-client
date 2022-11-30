import {cast, flow, types} from 'mobx-state-tree';
import AgoraRTC, {
  ConnectionDisconnectedReason,
  ConnectionState,
  IAgoraRTCRemoteUser,
  IMicrophoneAudioTrack
} from 'agora-rtc-sdk-ng';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api} from 'api';
import {appVariables} from 'api/constants';
import {AgoraRemoteUser, AgoraRemoteUserInterface} from 'core/models';
import {AgoraScreenShareStoreType} from 'stores/AgoraStore/AgoraScreenShareStore';

const AgoraMeetingStore = types
  .compose(
    ResetModel,
    types.model('AgoraMeetingStore', {
      appId: '',
      userId: types.maybe(types.string),
      spaceId: types.maybe(types.string),
      _users: types.optional(types.array(AgoraRemoteUser), []),
      connectionState: types.optional(types.frozen<ConnectionState>(), 'DISCONNECTED'),
      localSoundLevel: 0,

      tokenRequest: types.optional(RequestModel, {})
    })
  )
  .volatile(() => ({
    client: AgoraRTC.createClient({mode: 'rtc', codec: 'h264'})
  }))
  .views((self) => ({
    get users(): AgoraRemoteUserInterface[] {
      return self._users;
    },
    set users(users: AgoraRemoteUserInterface[]) {
      self._users = cast(users);
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

      const updatedUser = self.users.find((remoteUser) => remoteUser.uid === user.uid);

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
      const foundUser = self.users.find((remoteUser) => remoteUser.uid === user.uid);

      if (foundUser?.participantInfo) {
        if (mediaType === 'audio' && foundUser.audioTrack?.isPlaying) {
          foundUser.audioTrack?.stop();
        }

        if (mediaType === 'audio') {
          foundUser.isMuted = true;
        }
      }
    },
    handleUserJoined(user: IAgoraRTCRemoteUser) {
      if (String(user?.uid).split('|')[0] === 'ss') {
        return;
      }

      const foundUser = self.users.find((remoteUser) => remoteUser.uid === user.uid);

      const newUser: AgoraRemoteUserInterface = cast({
        uid: user.uid,
        participantInfo: user,
        isMuted: true,
        cameraOff: true
      });

      if (!foundUser) {
        self.users = [...self.users, newUser];
      }
    },
    handleUserLeft(user: IAgoraRTCRemoteUser) {
      if (String(user?.uid).split('|')[0] === 'ss') {
        return;
      }

      self.users = self.users.filter((remoteUser) => remoteUser.uid !== user.uid);
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

      self.users.forEach((remoteUser) => {
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
      self.client.on('user-joined', self.handleUserJoined);
      self.client.on('user-left', self.handleUserLeft);
      self.client.on('connection-state-change', self.handleConnectionStateChange);
      self.client.on('volume-indicator', self.handleVolumeIndicator);
    },
    cleanupListeners() {
      self.client.removeAllListeners();
    }
  }))
  // Common actions
  .actions((self) => ({
    init(appId: string) {
      self.client.enableAudioVolumeIndicator();
      self.appId = appId;
    },
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

      const tokenResponse: string = yield self.tokenRequest.send(
        api.agoraRepository_old.getAgoraToken,
        {
          spaceId: spaceId ?? self.spaceId,
          isStageMode: false
        }
      );

      return tokenResponse;
    })
  }))
  // State actions
  .actions((self) => ({
    join: flow(function* (
      spaceId: string,
      authStateSubject: string,
      createLocalTracks: (
        createAudioTrack: (
          deviceId: string,
          isTrackEnabled: boolean
        ) => Promise<IMicrophoneAudioTrack | undefined>
      ) => Promise<void>
    ) {
      const tokenResponse: string | undefined = yield self.getAgoraToken(spaceId);

      if (!tokenResponse) {
        return;
      }

      self.userId = yield self.client.join(self.appId, spaceId, tokenResponse, authStateSubject);
      yield createLocalTracks(self.createAudioTrackAndPublish);
      self.spaceId = spaceId;
      self.users = self.client.remoteUsers
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
      yield self.client.leave();
      self.spaceId = undefined;
      self.users = [];
    })
  }))
  .views((self) => ({
    get joined(): boolean {
      return self.spaceId !== undefined;
    },
    get maxVideoStreamsReached(): boolean {
      return self.users.length + 1 > appVariables.PARTICIPANTS_VIDEO_LIMIT;
    }
  }));

export {AgoraMeetingStore};
