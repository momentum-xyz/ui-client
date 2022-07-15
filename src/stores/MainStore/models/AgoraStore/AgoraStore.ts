import {flow, Instance, types} from 'mobx-state-tree';
import AgoraRTC, {
  ConnectionDisconnectedReason,
  ConnectionState,
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  IRemoteVideoTrack
} from 'agora-rtc-sdk-ng';

import {RequestModel, ResetModel} from 'core/models';
import {appVariables} from 'api/constants';
import {ParticipantRole} from 'core/enums';
import {api} from 'api';
import CONFIG from 'config/config';

import {UserDevicesStore, UserDevicesStoreInterface} from '../UserDevicesStore';

import {StageModeUser} from './models';

const AgoraStore = types
  .compose(
    ResetModel,
    types.model('AgoraStore', {
      // Common
      appId: appVariables.AGORA_APP_ID,
      userId: types.maybe(types.string),
      userDevicesStore: types.maybe(types.reference(UserDevicesStore)),

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
    remoteUsers: IAgoraRTCRemoteUser[];
  }>(() => ({
    videoCallClient: AgoraRTC.createClient({mode: 'rtc', codec: 'h264'}),
    stageModeClient: AgoraRTC.createClient({mode: 'live', codec: 'vp8'}),
    clientRoleOptions: {
      // Set latency level to low latency
      level: 1
    },

    // Stage Mode
    remoteUsers: []
  }))
  .actions((self) => ({
    // Common
    init(userDevicesStore: UserDevicesStoreInterface) {
      self.stageModeClient.enableDualStream();

      self.userDevicesStore = userDevicesStore;
    },

    // Stage Mode
    joinStageMode: flow(function* (spaceId: string, authStateSubject: string) {
      yield self.stageModeClient.setClientRole('audience');

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
    kickUser(userId: string) {
      const kickedUser = self.stageModeUsers.find((user) => user.uid === userId);

      if (kickedUser) {
        kickedUser.role = ParticipantRole.AUDIENCE_MEMBER;
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

    // Agora listeners
    handleUserPublished: flow(function* (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') {
      yield self.stageModeClient.subscribe(user, mediaType);
      self.remoteUsers = self.stageModeClient.remoteUsers;

      const isScreenshare = (user?.uid as string).split('|')[0] === 'ss';
      if (isScreenshare) {
        self.screenShare = user?.videoTrack;
      }
    }),
    handleUserUnpublished(user: IAgoraRTCRemoteUser) {
      self.remoteUsers = self.stageModeClient.remoteUsers.filter((item) => {
        return (item.uid as string).split('|')[0] !== 'ss';
      });
    },
    handleUserJoined(onScreenShare: () => void) {
      return (user: IAgoraRTCRemoteUser) => {
        const isScreenshare = (user?.uid as string).split('|')[0] === 'ss';
        if (isScreenshare) {
          onScreenShare();
          self.screenShare = user?.videoTrack;
        }

        self.remoteUsers = self.stageModeClient.remoteUsers;
      };
    },
    handleUserLeft(user: IAgoraRTCRemoteUser) {
      self.remoteUsers = self.stageModeClient.remoteUsers;

      const userId = user?.uid as string;
      const isScreenshare = userId.split('|')[0] === 'ss';
      if (isScreenshare) {
        self.screenShare = undefined;
      }
    },
    handleConnectionStateChange(
      curState: ConnectionState,
      revState: ConnectionState,
      reason?: ConnectionDisconnectedReason
    ) {
      console.info('[STAGEMODE] handleConnectionStateChange ', curState, revState, reason);
    },
    handleVolumeIndicator(users: IAgoraRTCRemoteUser[]) {
      const currentUser = users.find((user) => user.uid === self.userId);

      self.localSoundLevel = currentUser?.audioTrack?.getVolumeLevel() ?? 0;

      // TODO: finish
    }
  }))
  .actions((self) => ({
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
    leaveStageModeIfNeeded: flow(function* () {
      if (!self.isStageMode) {
        yield self.leaveStageMode();
      }
    })
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
