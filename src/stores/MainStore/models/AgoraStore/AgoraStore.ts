import {flow, Instance, types, cast} from 'mobx-state-tree';
import AgoraRTC, {
  ConnectionDisconnectedReason,
  ConnectionState,
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  IRemoteVideoTrack
} from 'agora-rtc-sdk-ng';

import {ResetModel, RequestModel} from 'core/models';
import {appVariables} from 'api/constants';
import {ParticipantRole} from 'core/enums';
import {api} from 'api';
import CONFIG from 'config/config';

import {StageModeUser, StageModeUserInterface, UserDevicesStore} from './models';

const AgoraStore = types
  .compose(
    ResetModel,
    types.model('AgoraStore', {
      // Common
      appId: appVariables.AGORA_APP_ID,
      userId: types.maybe(types.string),
      spaceId: types.maybe(types.string),
      userDevicesStore: types.optional(UserDevicesStore, {}),

      // Normal Call
      localSoundLevel: 0,
      connectionState: types.optional(types.frozen<ConnectionState>(), 'DISCONNECTED'),

      // Stage Mode
      isStageMode: false,
      toggledStageMode: false,
      isOnStage: false,
      isLowQualityModeEnabled: false,
      stageModeUsers: types.optional(types.array(StageModeUser), []),

      // Requests
      tokenRequest: types.optional(RequestModel, {})
    })
  )
  .volatile<{
    videoCallClient: IAgoraRTCClient;
    stageModeClient: IAgoraRTCClient;
    screenShareClient?: IAgoraRTCClient;
    screenShare?: IRemoteVideoTrack;
    clientRoleOptions: {level: number};
    remoteUsers: (IAgoraRTCRemoteUser & {soundLevel?: number})[];
    connectionState: ConnectionState;
  }>(() => ({
    videoCallClient: AgoraRTC.createClient({mode: 'rtc', codec: 'h264'}),
    stageModeClient: AgoraRTC.createClient({mode: 'live', codec: 'vp8'}),
    clientRoleOptions: {
      // Set latency level to low latency
      level: 1
    },

    // Stage Mode
    remoteUsers: [],
    connectionState: 'DISCONNECTED'
  }))
  .actions((self) => ({
    // Common
    init() {
      self.stageModeClient.enableDualStream();
      self.userDevicesStore.init();
    },
    createVideoTrackAndPublish: flow(function* () {
      if (self.isStageMode && self.stageModeClient.connectionState === 'CONNECTED') {
        const publishedCameraTrack = yield AgoraRTC.createCameraVideoTrack({
          cameraId: self.userDevicesStore.currentVideoInput?.deviceId,
          facingMode: 'user',
          // https://docs.agora.io/en/Agora%20Platform/video_profile_web_ng?platform=Web#recommended-video-profiles
          encoderConfig: '480p_1'
        });

        yield self.stageModeClient.publish(publishedCameraTrack);
        return publishedCameraTrack;
      } else if (self.videoCallClient.connectionState === 'CONNECTED') {
        const publishedCameraTrack = yield AgoraRTC.createCameraVideoTrack({
          cameraId: self.userDevicesStore.currentVideoInput?.deviceId,
          facingMode: 'user',
          // https://docs.agora.io/en/Agora%20Platform/video_profile_web_ng?platform=Web#recommended-video-profiles
          encoderConfig: '240p_1'
        });

        yield self.videoCallClient.publish(publishedCameraTrack);
        return publishedCameraTrack;
      }
    }),
    createAudioTrack: flow(function* () {
      if (self.isStageMode && self.stageModeClient.connectionState === 'CONNECTED') {
        const publishedAudioTrack = yield AgoraRTC.createMicrophoneAudioTrack({
          microphoneId: self.userDevicesStore.currentAudioInput?.deviceId
        });

        yield self.stageModeClient.publish(publishedAudioTrack);
        return publishedAudioTrack;
      } else if (self.videoCallClient.connectionState === 'CONNECTED') {
        const publishedAudioTrack = yield AgoraRTC.createMicrophoneAudioTrack({
          microphoneId: self.userDevicesStore.currentAudioInput?.deviceId
        });

        yield self.videoCallClient.publish(publishedAudioTrack);
        return publishedAudioTrack;
      }
    }),
    cleanupLocalTracks() {
      self.stageModeClient.localTracks.forEach((localTrack) => {
        localTrack.setEnabled(false);
        localTrack.stop();
        localTrack.close();
      });

      self.userDevicesStore.cleanupLocalTracks();
    },
    updateRemoteUsers() {
      if (self.isStageMode) {
        self.remoteUsers = self.stageModeClient.remoteUsers.filter((item) => {
          return (item.uid as string).split('|')[0] !== 'ss';
        });
      } else {
        self.remoteUsers = self.videoCallClient.remoteUsers.filter((item) => {
          return (item.uid as string).split('|')[0] !== 'ss';
        });
      }
    },

    // Video call

    joinOrStartVideoCall: flow(function* (spaceId: string, authStateSubject: string) {
      self.userId = yield self.videoCallClient.join(self.appId, spaceId, authStateSubject);
      self.spaceId = spaceId;

      const tokenResponse: string = yield self.tokenRequest.send(
        api.agoraRepository.getAgoraToken,
        {
          spaceId
        }
      );

      yield self.videoCallClient.join(self.appId, spaceId, tokenResponse, authStateSubject);

      self.remoteUsers = self.videoCallClient.remoteUsers;
    }),

    // Stage Mode

    joinStageMode: flow(function* (spaceId: string, authStateSubject: string) {
      yield self.stageModeClient.setClientRole('audience');
      self.spaceId = spaceId;

      const tokenResponse: string = yield self.tokenRequest.send(
        api.agoraRepository.getAgoraToken,
        {
          spaceId,
          isStageMode: true
        }
      );

      yield self.stageModeClient.join(
        self.appId,
        `stage-${spaceId}`,
        tokenResponse,
        authStateSubject
      );

      self.remoteUsers = self.stageModeClient.remoteUsers;
    }),
    enterStage: flow(function* () {
      if (!self.userDevicesStore) {
        return;
      }

      yield self.userDevicesStore.createLocalTracks(
        async (deviceId) =>
          await AgoraRTC.createMicrophoneAudioTrack({
            microphoneId: deviceId
          }),
        async (deviceId) =>
          await AgoraRTC.createCameraVideoTrack({
            cameraId: deviceId,
            facingMode: 'user',
            // https://docs.agora.io/en/Agora%20Platform/video_profile_web_ng?platform=Web#recommended-video-profiles
            encoderConfig: '480p_1'
          })
      );

      if (self.userDevicesStore.localAudioTrack) {
        if (self.userDevicesStore.localVideoTrack) {
          yield self.stageModeClient.publish([
            self.userDevicesStore.localAudioTrack,
            self.userDevicesStore.localVideoTrack
          ]);
        } else {
          yield self.stageModeClient.publish([self.userDevicesStore.localAudioTrack]);
        }
      }

      self.isOnStage = true;
      self.remoteUsers = self.stageModeClient.remoteUsers;
    }),
    leaveStage: flow(function* () {
      self.stageModeClient.localTracks.forEach((localTrack) => {
        localTrack.setEnabled(false);
        localTrack.stop();
      });

      yield self.stageModeClient.unpublish();
      self.isOnStage = false;
      yield self.stageModeClient.setClientRole('audience', self.clientRoleOptions);
    }),
    leaveStageMode: flow(function* () {
      self.stageModeClient.localTracks.forEach((localTrack) => {
        localTrack.setEnabled(false);
        localTrack.stop();
        localTrack.close();
      });

      yield self.stageModeClient.leave();
      self.remoteUsers = [];
      self.isOnStage = false;
    }),
    moveToAudience(userId: string) {
      const userToBeMoved = self.stageModeUsers.find((user) => user.uid === userId);

      if (userToBeMoved) {
        userToBeMoved.role = ParticipantRole.AUDIENCE_MEMBER;
      }
    },
    updateStageModeUsers() {
      self.stageModeUsers.forEach((stageModeUser) => {
        stageModeUser.role = self.remoteUsers.find(
          (remoteUser) => remoteUser.uid === stageModeUser.uid
        )
          ? ParticipantRole.SPEAKER
          : ParticipantRole.AUDIENCE_MEMBER;
      });
    },

    // TODO: Temporary - remove it after full refactor
    setStageModeUsers(stageModeUsers: StageModeUserInterface[]) {
      self.stageModeUsers = cast(stageModeUsers);
    },

    // Screen Sharing

    stopScreenShare() {
      self.screenShareClient?.localTracks.forEach((track) => {
        track.close();
      });
      self.screenShareClient?.leave();
      self.screenShareClient = undefined;
    },

    // Agora listeners
    handleUserPublished: flow(function* (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') {
      const isScreenshare = (user?.uid as string).split('|')[0] === 'ss';
      if (isScreenshare) {
        self.screenShare = user?.videoTrack;
      } else if (self.isStageMode) {
        yield self.stageModeClient.subscribe(user, mediaType);
        self.remoteUsers = self.stageModeClient.remoteUsers;
      } else {
        self.videoCallClient.subscribe(user, mediaType);
        self.remoteUsers = self.videoCallClient.remoteUsers;
      }
    }),
    handleUserUnpublished(user: IAgoraRTCRemoteUser) {
      // TODO: Might be refactored to use the same logic as handleUserPublished
      if (self.isStageMode) {
        self.remoteUsers = self.stageModeClient.remoteUsers.filter((item) => {
          return (item.uid as string).split('|')[0] !== 'ss';
        });
      } else {
        self.remoteUsers = self.remoteUsers.map((remoteUser) =>
          user.uid === remoteUser.uid
            ? {
                uid: user.uid,
                audioTrack: user.audioTrack,
                videoTrack: user.videoTrack,
                hasAudio: user.hasAudio,
                hasVideo: user.hasVideo,
                soundLevel: 0
              }
            : remoteUser
        );
      }
    },
    handleUserJoined(onScreenShare: () => void) {
      return (user: IAgoraRTCRemoteUser) => {
        const isScreenshare = (user?.uid as string).split('|')[0] === 'ss';
        if (isScreenshare) {
          onScreenShare();
          self.screenShare = user?.videoTrack;
        } else if (self.isStageMode) {
          self.remoteUsers = self.stageModeClient.remoteUsers;
        } else {
          self.remoteUsers = self.videoCallClient.remoteUsers;
        }
      };
    },
    handleUserLeft(user: IAgoraRTCRemoteUser) {
      self.remoteUsers = self.stageModeClient.remoteUsers;

      const userId = user?.uid as string;
      const isScreenshare = userId.split('|')[0] === 'ss';
      if (isScreenshare) {
        self.screenShare = undefined;
      } else {
        self.remoteUsers = self.remoteUsers.filter((remoteUser) => remoteUser.uid !== userId);
      }
    },
    handleConnectionStateChange(
      currentState: ConnectionState,
      previousState: ConnectionState,
      reason?: ConnectionDisconnectedReason
    ) {
      self.connectionState = currentState;
    },
    handleVolumeIndicator(users: IAgoraRTCRemoteUser[]) {
      const currentUser = users.find((user) => user.uid === self.userId);

      self.localSoundLevel = currentUser?.audioTrack?.getVolumeLevel() ?? 0;

      self.remoteUsers.forEach((user) => {
        const remoteUser = users.find((item) => item.uid === user.uid);
        user.soundLevel = remoteUser?.audioTrack?.getVolumeLevel();
      });
    }
  }))
  .actions((self) => ({
    // Common
    setupAgoraListeners(onScreenShare: () => void) {
      if (self.isStageMode) {
        self.stageModeClient.on('user-published', self.handleUserPublished);
        self.stageModeClient.on('user-unpublished', self.handleUserUnpublished);
        self.stageModeClient.on('user-joined', self.handleUserJoined(onScreenShare));
        self.stageModeClient.on('user-left', self.handleUserLeft);
        self.stageModeClient.on('connection-state-change', self.handleConnectionStateChange);
      } else {
        self.videoCallClient.on('user-published', self.handleUserPublished);
        self.videoCallClient.on('user-unpublished', self.handleUserUnpublished);
        self.videoCallClient.on('user-joined', self.handleUserJoined(onScreenShare));
        self.videoCallClient.on('user-left', self.handleUserLeft);
        self.videoCallClient.on('connection-state-change', self.handleConnectionStateChange);
        self.videoCallClient.on('volume-indicator', self.handleVolumeIndicator);
      }
    },
    clanupAgoraListeners() {
      if (self.isStageMode) {
        self.stageModeClient.removeAllListeners();
      } else {
        self.videoCallClient.removeAllListeners();
      }
    },
    toggleQuality: flow(function* () {
      yield Promise.all(
        self.remoteUsers.map((user) =>
          self.stageModeClient.setRemoteVideoStreamType(
            user.uid,
            self.isLowQualityModeEnabled ? 1 : 0
          )
        )
      );

      self.isLowQualityModeEnabled = !self.isLowQualityModeEnabled;
    }),

    // Video Call
    leaveCall: flow(function* () {
      self.cleanupLocalTracks();
      self.stopScreenShare();
      self.screenShare = undefined;
      self.remoteUsers = [];

      yield self.videoCallClient.leave();
    }),

    // Stage Mode
    leaveStageModeIfNeeded: flow(function* () {
      if (!self.isStageMode) {
        yield self.leaveStageMode();
      }
    }),
    kickUserOffStage: flow(function* (userId: string) {
      if (userId === self.userId) {
        self.moveToAudience(userId);
      } else {
        yield self.leaveStage();
        self.moveToAudience(userId);
      }
    }),
    addStageModeUser(userId: string) {
      if (self.stageModeUsers.filter((user) => user.uid === userId).length !== 0) {
        return;
      }

      self.stageModeUsers.push({
        uid: userId,
        role: ParticipantRole.AUDIENCE_MEMBER
      });
    },
    removeStageModeUser(userId: string) {
      self.remoteUsers = self.remoteUsers.filter((user) => user.uid !== userId);
    }
  }))
  .views((self) => ({
    get canEnterStage(): boolean {
      return (
        self.stageModeClient.remoteUsers.length + (self.isOnStage ? 1 : 0) <
        CONFIG.video.MAX_STAGE_USERS
      );
    }
  }));

export interface AgoraStoreInterface extends Instance<typeof AgoraStore> {}

export {AgoraStore};
