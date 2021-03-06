import {flow, Instance, types, cast} from 'mobx-state-tree';
import AgoraRTC, {
  ConnectionDisconnectedReason,
  ConnectionState,
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  IMicrophoneAudioTrack,
  IRemoteVideoTrack
} from 'agora-rtc-sdk-ng';

import {StageModeJoinResponse} from 'api/repositories/stageModeRepository/stageModeRepository.api.types';
import {ResetModel, RequestModel} from 'core/models';
import {appVariables} from 'api/constants';
import {
  ModerationEnum,
  ParticipantRole,
  StageModeRequestEnum,
  StageModeUserRoleEnum
} from 'core/enums';
import {api} from 'api';
import {SpaceIntegrationsStageModeResponse} from 'api/repositories/spaceIntegrationsRepository/spaceIntegrations.api.types';
import {bytesToUuid} from 'core/utils';

import {AgoraRemoteUser, AgoraRemoteUserInterface, StageModeUser, UserDevicesStore} from './models';

const AgoraStore = types
  .compose(
    ResetModel,
    types.model('AgoraStore', {
      // Common
      appId: '',
      userId: types.maybe(types.string),
      spaceId: types.maybe(types.string),
      userDevicesStore: types.optional(UserDevicesStore, {}),
      remoteUsers: types.optional(types.array(AgoraRemoteUser), []),
      requestWasMadeToGoOnStage: false,

      // Chat
      isChatOpen: false,

      // Normal Call
      localSoundLevel: 0,
      connectionState: types.optional(types.frozen<ConnectionState>(), 'DISCONNECTED'),

      // Stage Mode
      isStageMode: false,
      joinedStageMode: false,
      toggledStageMode: false,
      isOnStage: false,
      isLowQualityModeEnabled: false,
      stageModeUsers: types.optional(types.array(StageModeUser), []),

      // Requests
      tokenRequest: types.optional(RequestModel, {}),
      joinStageModeRequest: types.optional(RequestModel, {}),
      leaveStageModeRequest: types.optional(RequestModel, {}),
      spaceIntegrationsRequest: types.optional(RequestModel, {}),
      invitationRespondRequest: types.optional(RequestModel, {}),
      requestRespondRequest: types.optional(RequestModel, {}),
      stageModeInviteRequest: types.optional(RequestModel, {}),
      stageModeRequestRequest: types.optional(RequestModel, {}),
      stageModeMuteRequest: types.optional(RequestModel, {}),
      stageModeKickRequest: types.optional(RequestModel, {}),
      muteRequest: types.optional(RequestModel, {}),
      muteAllRequest: types.optional(RequestModel, {}),
      toggleStageModeRequest: types.optional(RequestModel, {}),
      screenShareTokenRequest: types.optional(RequestModel, {})
    })
  )
  .volatile<{
    videoCallClient: IAgoraRTCClient;
    stageModeClient: IAgoraRTCClient;
    screenShareClient?: IAgoraRTCClient;
    _screenShare?: IRemoteVideoTrack;
  }>(() => ({
    videoCallClient: AgoraRTC.createClient({mode: 'rtc', codec: 'h264'}),
    stageModeClient: AgoraRTC.createClient({mode: 'live', codec: 'vp8'}),
    _screenShare: undefined
  }))
  .views((self) => ({
    get screenShare(): IRemoteVideoTrack | undefined {
      return self._screenShare;
    },
    set screenShare(value: IRemoteVideoTrack | undefined) {
      self._screenShare = value;
    }
  }))
  // API Requests
  .actions((self) => ({
    getAgoraToken: flow(function* (isStageMode: boolean, spaceId?: string) {
      const tokenResponse: string = yield self.tokenRequest.send(
        api.agoraRepository.getAgoraToken,
        {
          spaceId: spaceId ?? self.spaceId,
          isStageMode
        }
      );

      return tokenResponse;
    }),
    requestRespond: flow(function* (
      userId: string,
      stageModeRequestType: StageModeRequestEnum.ACCEPT | StageModeRequestEnum.DECLINE
    ) {
      if (!self.spaceId) {
        return;
      }

      return yield self.requestRespondRequest.send(api.stageModeRepository.respondToRequest, {
        spaceId: self.spaceId,
        userId,
        stageModeRequestType
      });
    }),
    invitationRespond: flow(function* (
      stageModeRequestType: StageModeRequestEnum.ACCEPT | StageModeRequestEnum.DECLINE
    ) {
      if (!self.spaceId) {
        return;
      }

      yield self.invitationRespondRequest.send(api.stageModeRepository.respondToInvite, {
        spaceId: self.spaceId,
        stageModeRequestType
      });
    }),
    getStageModeStatus: flow(function* (spaceId?: string) {
      const status: SpaceIntegrationsStageModeResponse = yield self.spaceIntegrationsRequest.send(
        api.spaceIntegrationsRepository.fetchStageModeStatus,
        {spaceId: spaceId ?? self.spaceId}
      );

      return status;
    }),
    inviteToStage: flow(function* (userId: string) {
      if (!self.spaceId) {
        return;
      }

      yield self.stageModeInviteRequest.send(api.stageModeRepository.inviteToStage, {
        spaceId: self.spaceId,
        userId
      });
    }),
    requestToGoOnStage: flow(function* () {
      if (!self.spaceId) {
        return;
      }

      self.requestWasMadeToGoOnStage = true;

      try {
        yield self.stageModeRequestRequest.send(api.stageModeRepository.requestToJoin, {
          spaceId: self.spaceId
        });
      } catch (e) {
        self.requestWasMadeToGoOnStage = false;
        throw e;
      }
    }),
    muteRemoteUser: flow(function* (userId: string) {
      if (!self.spaceId) {
        return;
      }

      if (self.isStageMode) {
        yield self.stageModeMuteRequest.send(api.stageModeRepository.mute, {
          spaceId: self.spaceId,
          userId
        });
      } else {
        yield self.muteRequest.send(api.communicationRepository.muteParticipant, {
          spaceId: self.spaceId,
          userId
        });
      }
    }),
    muteAllRemoteUsers: flow(function* () {
      if (!self.spaceId || self.isStageMode) {
        return;
      }

      yield self.muteAllRequest.send(api.communicationRepository.muteAllParticipants, {
        spaceId: self.spaceId
      });
    })
  }))
  // Listeners for Agora Client
  .actions((self) => ({
    handleUserPublished: flow(function* (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') {
      const isScreenshare = (user?.uid as string).split('|')[0] === 'ss';

      if (!isScreenshare) {
        if ((user.hasAudio && mediaType === 'audio') || (user.hasVideo && mediaType === 'video')) {
          yield (self.isStageMode ? self.stageModeClient : self.videoCallClient).subscribe(
            user,
            mediaType
          );
        }

        if (user.hasAudio && mediaType === 'audio') {
          user.audioTrack?.play();
        }

        const updatedUser = self.remoteUsers.find((remoteUser) => remoteUser.uid === user.uid);

        if (updatedUser) {
          updatedUser.participantInfo = user;
          if (mediaType === 'audio') {
            updatedUser.isMuted = !user.hasAudio;
            updatedUser.audioTrack = user.audioTrack;
          } else {
            updatedUser.cameraOff = !user.hasVideo;
            updatedUser.videoTrack = user.videoTrack;
          }

          self.remoteUsers = cast(
            self.remoteUsers.map((remoteUser) =>
              remoteUser.uid === user.uid ? updatedUser : remoteUser
            )
          );
        }
      } else {
        yield self.videoCallClient.subscribe(user, mediaType);
        self.screenShare = user?.videoTrack;
      }
    }),
    handleUserUnpublished: flow(function* (
      user: IAgoraRTCRemoteUser,
      mediaType: 'audio' | 'video'
    ) {
      const isScreenshare = (user?.uid as string).split('|')[0] === 'ss';

      if (isScreenshare) {
        self.screenShare = undefined;
      } else {
        const foundUser = self.remoteUsers.find((remoteUser) => remoteUser.uid === user.uid);

        if (foundUser?.participantInfo) {
          if (mediaType === 'audio' && foundUser.audioTrack?.isPlaying) {
            foundUser.audioTrack?.stop();
          }

          yield (self.isStageMode ? self.stageModeClient : self.videoCallClient).unsubscribe(
            foundUser.participantInfo,
            mediaType
          );

          const updatedUser = self.remoteUsers.find((remoteUser) => remoteUser.uid === user.uid);

          if (updatedUser) {
            if (mediaType === 'audio') {
              updatedUser.isMuted = true;
            } else {
              updatedUser.cameraOff = true;
            }
          }
        }
      }
    }),
    handleUserJoined(user: IAgoraRTCRemoteUser) {
      const isScreenshare = (user?.uid as string).split('|')[0] === 'ss';
      if (!isScreenshare) {
        const foundUser = self.remoteUsers.find((remoteUser) => remoteUser.uid === user.uid);

        const newUser: AgoraRemoteUserInterface = cast({
          uid: user.uid,
          participantInfo: user,
          isMuted: true,
          cameraOff: true
        });

        if (!foundUser) {
          self.remoteUsers = cast([...self.remoteUsers, newUser]);
        }
      }
    },
    handleUserLeft(user: IAgoraRTCRemoteUser) {
      const isScreenshare = (user.uid as string).split('|')[0] === 'ss';
      if (isScreenshare) {
        self.screenShare = undefined;
      } else {
        self.remoteUsers = cast(
          self.remoteUsers.filter((remoteUser) => remoteUser.uid !== user.uid)
        );
      }
    },
    handleConnectionStateChange(
      currentState: ConnectionState,
      previousState: ConnectionState,
      reason?: ConnectionDisconnectedReason
    ) {
      self.connectionState = currentState;

      if (currentState === 'CONNECTED' && self.isStageMode) {
        self.joinedStageMode = true;
      }
    },
    handleVolumeIndicator(users: {uid: string; level: number}[]) {
      const currentUser = users.find((user) => user.uid === self.userId);

      self.localSoundLevel = currentUser?.level ?? 0;

      self.remoteUsers.forEach((remoteUser) => {
        const user = users.find((user) => remoteUser.uid === user.uid);
        remoteUser.soundLevel = user?.level ?? 0;
      });
    }
  }))
  // Initializer and track creation
  .actions((self) => ({
    init() {
      AgoraRTC.setLogLevel(4);
      self.stageModeClient.enableDualStream();
      self.userDevicesStore.init();
      self.appId = appVariables.AGORA_APP_ID;
    },
    createVideoTrackAndPublish: flow(function* (deviceId: string) {
      if (self.isStageMode && self.stageModeClient.connectionState === 'CONNECTED') {
        const publishedCameraTrack = yield AgoraRTC.createCameraVideoTrack({
          cameraId: deviceId,
          facingMode: 'user',
          // https://docs.agora.io/en/Agora%20Platform/video_profile_web_ng?platform=Web#recommended-video-profiles
          encoderConfig: '480p_1'
        });

        yield self.stageModeClient.publish(publishedCameraTrack);
        yield publishedCameraTrack.setEnabled(!self.userDevicesStore.cameraOff);

        return publishedCameraTrack;
      } else if (self.videoCallClient.connectionState === 'CONNECTED') {
        const publishedCameraTrack = yield AgoraRTC.createCameraVideoTrack({
          cameraId: deviceId,
          facingMode: 'user',
          // https://docs.agora.io/en/Agora%20Platform/video_profile_web_ng?platform=Web#recommended-video-profiles
          encoderConfig: '240p_1'
        });

        yield self.videoCallClient.publish(publishedCameraTrack);
        yield publishedCameraTrack.setEnabled(!self.userDevicesStore.cameraOff);

        return publishedCameraTrack;
      }

      return undefined;
    }),
    createAudioTrackAndPublish: flow<IMicrophoneAudioTrack, [deviceId: string]>(function* (
      deviceId: string
    ) {
      if (self.isStageMode && self.stageModeClient.connectionState === 'CONNECTED') {
        const publishedAudioTrack: IMicrophoneAudioTrack =
          yield AgoraRTC.createMicrophoneAudioTrack({
            microphoneId: deviceId
          });

        yield self.stageModeClient.publish(publishedAudioTrack);
        publishedAudioTrack.setEnabled(!self.userDevicesStore.muted);

        return publishedAudioTrack;
      } else if (self.videoCallClient.connectionState === 'CONNECTED') {
        const publishedAudioTrack = yield AgoraRTC.createMicrophoneAudioTrack({
          microphoneId: deviceId
        });

        yield self.videoCallClient.publish(publishedAudioTrack);
        publishedAudioTrack.setEnabled(!self.userDevicesStore.muted);

        return publishedAudioTrack;
      }

      return undefined;
    }),

    createScreenTrackAndPublish: flow(function* () {
      if (!self.screenShareClient) {
        return undefined;
      }

      const screenTrack = yield AgoraRTC.createScreenVideoTrack(
        {
          encoderConfig: {
            width: {
              max: 1280
            },
            height: {
              max: 720
            },
            frameRate: {
              max: 30
            },
            bitrateMax: 2000
          }
        },
        'disable'
      );

      yield self.screenShareClient?.publish(screenTrack);
      return screenTrack;
    })
  }))
  // Screeensharing and chat visibility
  .actions((self) => ({
    stopScreenShare() {
      self.screenShareClient?.localTracks.forEach((track) => {
        track.close();
      });
      self.screenShareClient?.leave();
      self.screenShareClient = undefined;
    },
    startScreenShare: flow(function* (authStateSubject: string) {
      if (self.spaceId) {
        self.screenShareClient = AgoraRTC.createClient({
          mode: self.isStageMode ? 'live' : 'rtc',
          codec: 'h264'
        });

        if (self.isStageMode) {
          yield self.screenShareClient.setClientRole('host');
        }

        const response: string = yield self.screenShareTokenRequest.send(
          api.agoraRepository.getAgoraScreenShareToken,
          {
            spaceId: self.spaceId,
            isStageMode: self.isStageMode
          }
        );

        yield self.screenShareClient.join(
          self.appId,
          self.isStageMode ? 'stage-' + self.spaceId : self.spaceId,
          response,
          'ss|' + authStateSubject
        );

        yield self.createScreenTrackAndPublish();
      }
    }),
    showChat() {
      self.isChatOpen = true;
    },
    hideChat() {
      self.isChatOpen = false;
    }
  }))
  // Agora calls setups and chat toggle
  .actions((self) => ({
    // --- COMMON ---
    setupAgoraListeners() {
      if (self.isStageMode) {
        self.stageModeClient.enableAudioVolumeIndicator();

        self.stageModeClient.on('user-published', self.handleUserPublished);
        self.stageModeClient.on('user-unpublished', self.handleUserPublished);
        self.stageModeClient.on('user-joined', self.handleUserJoined);
        self.stageModeClient.on('user-left', self.handleUserLeft);
        self.stageModeClient.on('connection-state-change', self.handleConnectionStateChange);
        self.stageModeClient.on('volume-indicator', self.handleVolumeIndicator);
      } else {
        self.videoCallClient.enableAudioVolumeIndicator();

        self.videoCallClient.on('user-published', self.handleUserPublished);
        self.videoCallClient.on('user-unpublished', self.handleUserPublished);
        self.videoCallClient.on('user-joined', self.handleUserJoined);
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

    // --- VIDEO CALL ---

    joinOrStartVideoCall: flow(function* (spaceId: string, authStateSubject: string) {
      self.spaceId = spaceId;

      const tokenResponse = yield self.getAgoraToken(false, spaceId);

      self.userId = yield self.videoCallClient.join(
        self.appId,
        spaceId,
        tokenResponse,
        authStateSubject
      );

      self.userDevicesStore.createLocalTracks(
        self.createAudioTrackAndPublish,
        self.createVideoTrackAndPublish
      );
    }),
    leaveCall: flow(function* () {
      self.userDevicesStore.cleanupLocalTracks();
      self.stopScreenShare();

      yield self.videoCallClient.leave();
      self.screenShare = undefined;
      self.remoteUsers = cast([]);
    }),

    // --- STAGE MODE ---

    joinStageMode: flow(function* (spaceId: string, authStateSubject: string) {
      if (self.isStageMode) {
        return;
      }

      const stageModeResponse: StageModeJoinResponse = yield self.joinStageModeRequest.send(
        api.stageModeRepository.joinStageMode,
        {
          spaceId: spaceId
        }
      );

      yield self.stageModeClient.setClientRole('audience');
      self.spaceId = spaceId;

      const tokenResponse = yield self.getAgoraToken(true, spaceId);

      yield self.stageModeClient.join(
        self.appId,
        `stage-${spaceId}`,
        tokenResponse,
        authStateSubject
      );

      self.joinedStageMode = true;
      self.isStageMode = true;
      self.stageModeUsers = cast(
        stageModeResponse.spaceIntegrationUsers?.map((user) => ({
          uid: bytesToUuid(user.userId.data),
          role:
            user.data.role === 'speaker' ? ParticipantRole.SPEAKER : ParticipantRole.AUDIENCE_MEMBER
        }))
      );
    }),
    leaveStageMode: flow(function* () {
      yield self.leaveStageModeRequest.send(api.stageModeRepository.leaveStageMode, {
        spaceId: self.spaceId
      });

      self.userDevicesStore.cleanupLocalTracks();

      yield self.stageModeClient.leave();
      self.remoteUsers = cast([]);
      self.joinedStageMode = false;
      self.isOnStage = false;
      self.isStageMode = false;
    }),
    enterStage: flow(function* () {
      if (!self.userDevicesStore) {
        return;
      }

      yield self.stageModeClient.setClientRole('host');

      yield self.userDevicesStore.createLocalTracks(
        self.createAudioTrackAndPublish,
        self.createVideoTrackAndPublish
      );

      self.isOnStage = true;
    }),
    leaveStage: flow(function* () {
      self.stageModeClient.localTracks.forEach((localTrack) => {
        localTrack.setEnabled(false);
        localTrack.stop();
      });

      yield self.stageModeClient.unpublish();
      self.isOnStage = false;
      yield self.stageModeClient.setClientRole('audience', {
        level: 1
      });
    }),

    // --- CHAT TOGGLING ---

    toggleChat() {
      if (self.isChatOpen) {
        self.hideChat();
      } else {
        self.showChat();
      }
    }
  }))
  // Meeting space managment
  .actions((self) => ({
    joinMeetingSpace: flow(function* (authStateSubject: string, spaceId?: string) {
      const status: SpaceIntegrationsStageModeResponse = yield self.getStageModeStatus(spaceId);

      const isStageMode = status.data?.stageModeStatus === 'initiated';

      if (isStageMode) {
        if (self.spaceId) {
          yield self.leaveCall();
        }

        if (!self.spaceId && !spaceId) {
          return;
        }

        if (spaceId) {
          yield self.joinStageMode(spaceId, authStateSubject);
        } else if (self.spaceId) {
          yield self.joinStageMode(self.spaceId, authStateSubject);
        }

        self.stageModeUsers = cast(
          status.spaceIntegrationUsers?.map((user) => ({
            uid: bytesToUuid(user.userId.data),
            role:
              user.data.role === StageModeUserRoleEnum.SPEAKER
                ? ParticipantRole.SPEAKER
                : ParticipantRole.AUDIENCE_MEMBER
          })) ?? []
        );
      } else {
        if (self.spaceId) {
          yield self.leaveStageMode();
        }

        if (!self.spaceId && !spaceId) {
          return;
        }

        if (spaceId) {
          yield self.joinOrStartVideoCall(spaceId, authStateSubject);
        } else if (self.spaceId) {
          yield self.joinOrStartVideoCall(self.spaceId, authStateSubject);
        }
      }
      self.clanupAgoraListeners();
      self.setupAgoraListeners();
    }),
    leaveMeetingSpace: flow(function* () {
      if (self.isStageMode) {
        yield self.leaveStageMode();
      } else {
        yield self.leaveCall();
      }

      self.spaceId = undefined;
    }),

    moveToAudience(userId: string) {
      const userToBeMoved = self.stageModeUsers.find((user) => user.uid === userId);

      if (userToBeMoved) {
        userToBeMoved.role = ParticipantRole.AUDIENCE_MEMBER;
      }

      if (userId === self.userId) {
        self.leaveStage();
      }
    }
  }))
  // Stage mode actions
  .actions((self) => ({
    toggleStageMode: flow(function* (userId: string) {
      if (!self.spaceId) {
        return;
      }

      if (self.isStageMode) {
        yield self.toggleStageModeRequest.send(api.spaceIntegrationsRepository.disableStageMode, {
          spaceId: self.spaceId,
          userId
        });
      } else {
        yield self.toggleStageModeRequest.send(api.spaceIntegrationsRepository.enableStageMode, {
          spaceId: self.spaceId,
          userId
        });
      }
    }),
    kickUserOffStage: flow(function* (userId: string) {
      if (!self.spaceId) {
        return;
      }

      yield self.stageModeKickRequest.send(api.stageModeRepository.admitOrKick, {
        spaceId: self.spaceId,
        userId,
        modType: ModerationEnum.KICK
      });

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
      self.remoteUsers = cast(self.remoteUsers.filter((user) => user.uid !== userId));
    },
    requestToGoOnstageWasHandled() {
      self.requestWasMadeToGoOnStage = false;
    }
  }))
  .views((self) => ({
    get canEnterStage(): boolean {
      return (
        self.stageModeClient.remoteUsers.length + (self.isOnStage ? 1 : 0) <
        appVariables.MAX_STAGE_USERS
      );
    },
    get hasJoined(): boolean {
      return self.spaceId !== undefined;
    },
    get numberOfSpeakers(): number {
      return (
        self.stageModeUsers.filter((user) => user.role === ParticipantRole.SPEAKER).length +
        (self.isOnStage ? 1 : 0)
      );
    },
    get numberOfAudienceMembers(): number {
      return (
        self.stageModeUsers.filter((user) => user.role === ParticipantRole.AUDIENCE_MEMBER).length -
        (self.isOnStage ? 1 : 0)
      );
    }
  }));

export interface AgoraStoreInterface extends Instance<typeof AgoraStore> {}

export {AgoraStore};
