import {cast, flow, types} from 'mobx-state-tree';
import AgoraRTC, {
  ConnectionDisconnectedReason,
  ConnectionState,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack
} from 'agora-rtc-sdk-ng';

import {api} from 'api';
import {appVariables} from 'api/constants';
import {AgoraRemoteUser, AgoraRemoteUserInterface, RequestModel, ResetModel} from 'core/models';

const AgoraMeetingStore = types
  .compose(
    ResetModel,
    types.model('AgoraMeetingStore', {
      appId: '',
      userId: types.maybe(types.string),
      spaceId: types.maybe(types.string),
      users: types.optional(types.array(AgoraRemoteUser), []),
      connectionState: types.optional(types.frozen<ConnectionState>(), 'DISCONNECTED'),
      localSoundLevel: 0,

      tokenRequest: types.optional(RequestModel, {}),
      muteRequest: types.optional(RequestModel, {}),
      muteAllRequest: types.optional(RequestModel, {})
    })
  )
  .volatile(() => ({
    client: AgoraRTC.createClient({mode: 'rtc', codec: 'h264'})
  }))
  // Listeners handlers
  .actions((self) => ({
    handleUserPublished: flow(function* (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') {
      if ((user?.uid as string).split('|')[0] === 'ss') {
        return;
      }

      if ((user.hasAudio && mediaType === 'audio') || (user.hasVideo && mediaType === 'video')) {
        yield self.client.subscribe(user, mediaType);
      }

      if (user.hasAudio && mediaType === 'audio') {
        user.audioTrack?.play();
      }

      const updatedUser = self.users.find((remoteUser) => remoteUser.uid === user.uid);

      if (updatedUser) {
        updatedUser.participantInfo = user;
        if (mediaType === 'audio') {
          updatedUser.isMuted = !user.hasAudio;
          updatedUser.audioTrack = user.audioTrack;
        } else {
          updatedUser.cameraOff = !user.hasVideo;
          updatedUser.videoTrack = user.videoTrack;
        }
      }
    }),
    handleUserUnpublished: flow(function* (
      user: IAgoraRTCRemoteUser,
      mediaType: 'audio' | 'video'
    ) {
      if ((user?.uid as string).split('|')[0] === 'ss') {
        return;
      }

      const foundUser = self.users.find((remoteUser) => remoteUser.uid === user.uid);

      if (foundUser?.participantInfo) {
        if (mediaType === 'audio' && foundUser.audioTrack?.isPlaying) {
          foundUser.audioTrack?.stop();
        }

        yield self.client.unsubscribe(foundUser.participantInfo, mediaType);

        if (mediaType === 'audio') {
          foundUser.isMuted = true;
        } else {
          foundUser.cameraOff = true;
        }
      }
    }),
    handleUserJoined(user: IAgoraRTCRemoteUser) {
      if ((user?.uid as string).split('|')[0] === 'ss') {
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
        self.users = cast([...self.users, newUser]);
      }
    },
    handleUserLeft(user: IAgoraRTCRemoteUser) {
      if ((user?.uid as string).split('|')[0] === 'ss') {
        return;
      }

      self.users = cast(self.users.filter((remoteUser) => remoteUser.uid !== user.uid));
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
    setupAgoraListeners() {
      self.client.on('user-published', self.handleUserPublished);
      self.client.on('user-unpublished', self.handleUserPublished);
      self.client.on('user-joined', self.handleUserJoined);
      self.client.on('user-left', self.handleUserLeft);
      self.client.on('connection-state-change', self.handleConnectionStateChange);
      self.client.on('volume-indicator', self.handleVolumeIndicator);
    },
    cleanupListeners() {
      self.client.removeAllListeners();
    }
  }))
  // API Requests
  .actions((self) => ({
    muteRemoteUser: flow(function* (userId: string) {
      if (!self.spaceId) {
        return;
      }

      yield self.muteRequest.send(api.meetingRepository.muteUser, {
        spaceId: self.spaceId,
        userId
      });
    }),
    muteAllRemoteUsers: flow(function* () {
      yield self.muteAllRequest.send(api.meetingRepository.muteAllUsers, {
        spaceId: self.spaceId
      });
    })
  }))
  // Common actions
  .actions((self) => ({
    init(appId: string) {
      self.client.enableAudioVolumeIndicator();
      self.appId = appId;
    },
    createVideoTrackAndPublish: flow(function* (deviceId: string, isTrackEnabled: boolean) {
      if (self.client.connectionState !== 'CONNECTED') {
        return undefined;
      }

      const publishedCameraTrack = yield AgoraRTC.createCameraVideoTrack({
        cameraId: deviceId,
        facingMode: 'user',
        // https://docs.agora.io/en/Agora%20Platform/video_profile_web_ng?platform=Web#recommended-video-profiles
        encoderConfig: '240p_1'
      });

      yield self.client.publish(publishedCameraTrack);
      yield publishedCameraTrack.setEnabled(isTrackEnabled);

      return publishedCameraTrack;
    }),
    createAudioTrackAndPublish: flow(function* (deviceId: string, isTrackEnabled: boolean) {
      if (self.client.connectionState !== 'CONNECTED') {
        return undefined;
      }

      const publishedAudioTrack = yield AgoraRTC.createMicrophoneAudioTrack({
        microphoneId: deviceId
      });

      yield self.client.publish(publishedAudioTrack);
      publishedAudioTrack.setEnabled(isTrackEnabled);

      return publishedAudioTrack;
    }),
    getAgoraToken: flow(function* (spaceId?: string) {
      const tokenResponse: string = yield self.tokenRequest.send(
        api.agoraRepository.getAgoraToken,
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
        ) => Promise<IMicrophoneAudioTrack | undefined>,
        createVideoTrack: (
          deviceId: string,
          isTrackEnabled: boolean
        ) => Promise<ICameraVideoTrack | undefined>
      ) => void
    ) {
      const tokenResponse = yield self.getAgoraToken(spaceId);
      self.userId = yield self.client.join(self.appId, spaceId, tokenResponse, authStateSubject);
      createLocalTracks(self.createAudioTrackAndPublish, self.createVideoTrackAndPublish);
      self.spaceId = spaceId;
    }),
    leave: flow(function* () {
      yield self.client.leave();
      self.spaceId = undefined;
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
