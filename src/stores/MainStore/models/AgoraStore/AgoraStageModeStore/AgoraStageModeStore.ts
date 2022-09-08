import {flow, types, cast} from 'mobx-state-tree';
import AgoraRTC, {
  ConnectionDisconnectedReason,
  ConnectionState,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack
} from 'agora-rtc-sdk-ng';

import {
  AgoraRemoteUserInterface,
  RequestModel,
  ResetModel,
  StageModeUser,
  StageModeUserInterface,
  AgoraRemoteUser
} from 'core/models';
import {api} from 'api';
import {ModerationEnum, ParticipantRoleEnum, StageModeRequestEnum} from 'core/enums';
import {appVariables} from 'api/constants';
import {AgoraScreenShareStoreInterface} from 'stores/MainStore/models/AgoraStore/AgoraScreenShareStore';
import {StageModeJoinResponse} from 'api/repositories/stageModeRepository/stageModeRepository.api.types';
import {bytesToUuid} from 'core/utils';

const AgoraStageModeStore = types
  .compose(
    ResetModel,
    types.model('AgoraStageModeStore', {
      appId: '',
      spaceId: types.maybe(types.string),
      userId: types.maybe(types.string),
      toggledStageMode: false,
      isOnStage: false,
      isTogglingIsOnStage: false,
      isLowQualityModeEnabled: false,
      requestWasMadeToGoOnStage: false,
      // Users coming from backend and PosBus, in future to be replaced with audience when the whole Stage
      // Mode infrustructure will be working well
      backendUsers: types.optional(types.array(StageModeUser), []),
      speakers: types.optional(types.array(AgoraRemoteUser), []),
      localSoundLevel: 0,
      connectionState: types.optional(types.frozen<ConnectionState>(), 'DISCONNECTED'),
      isJoining: false,

      tokenRequest: types.optional(RequestModel, {}),
      joinStageModeRequest: types.optional(RequestModel, {}),
      leaveStageModeRequest: types.optional(RequestModel, {}),
      stageModeInviteRequest: types.optional(RequestModel, {}),
      stageModeRequestRequest: types.optional(RequestModel, {}),
      stageModeMuteRequest: types.optional(RequestModel, {}),
      stageModeKickRequest: types.optional(RequestModel, {}),
      invitationRespondRequest: types.optional(RequestModel, {}),
      requestRespondRequest: types.optional(RequestModel, {})
    })
  )
  .volatile(() => ({
    client: (() => {
      const client = AgoraRTC.createClient({mode: 'live', codec: 'vp8'});
      client.enableDualStream();

      return client;
    })()
  }))
  .views((self) => ({
    // TODO: Remove when whole infostructure is stable for Stage Mode
    get audience(): StageModeUserInterface[] {
      return self.backendUsers.filter((user) => {
        return (
          user.role === ParticipantRoleEnum.AUDIENCE_MEMBER &&
          user.uid !== self.userId &&
          !self.speakers.find((u) => u.uid === user.uid)
        );
      });
    },
    get joined(): boolean {
      return self.spaceId !== undefined;
    },
    get canEnterStage(): boolean {
      return self.speakers.length + (self.isOnStage ? 1 : 0) < appVariables.MAX_STAGE_USERS;
    },
    get numberOfSpeakers(): number {
      return self.speakers.length + (self.isOnStage ? 1 : 0);
    }
  }))
  .views((self) => ({
    get numberOfAudienceMembers(): number {
      return self.audience.length + Number(!self.isOnStage);
    }
  }))
  // API Requests
  .actions((self) => ({
    inviteToStage: flow(function* (userId: string) {
      if (!self.spaceId) {
        return;
      }

      yield self.stageModeInviteRequest.send(api.stageModeRepository.inviteToStage, {
        spaceId: self.spaceId,
        userId
      });

      return self.stageModeInviteRequest.isDone;
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
    muteRemoteUser: flow(function* (userId: string) {
      if (!self.spaceId) {
        return;
      }

      yield self.stageModeMuteRequest.send(api.stageModeRepository.mute, {
        spaceId: self.spaceId,
        userId
      });
    })
  }))
  // users manipulations
  // TODO: Refactor all actions in this block to use self.audience when whole infortructure is stable
  .actions((self) => ({
    addBackendUser(userId: string) {
      if (self.backendUsers.find((user) => user.uid === userId) || userId === self.userId) {
        return;
      }

      self.backendUsers.push({
        uid: userId,
        role: ParticipantRoleEnum.AUDIENCE_MEMBER
      });
    },
    removeBackendUser(userId: string) {
      if (userId === self.userId) {
        return;
      }

      if (self.isJoining) {
        setTimeout(() => {
          this.removeBackendUser(userId);
        }, 100);
        return;
      }

      self.backendUsers = cast(self.backendUsers.filter((user) => user.uid !== userId));
    }
  }))
  // Listeners handlers
  .actions((self) => ({
    handleUserPublished: flow(function* (
      screenShareStore: AgoraScreenShareStoreInterface,
      user: IAgoraRTCRemoteUser,
      mediaType: 'audio' | 'video'
    ) {
      yield self.client.subscribe(user, mediaType);

      if (String(user?.uid).split('|')[0] === 'ss') {
        screenShareStore.handleUserPublished(user, mediaType);
        return;
      }

      if (mediaType === 'audio') {
        user.audioTrack?.play();
      }

      const updatedUser = self.speakers.find((remoteUser) => remoteUser.uid === user.uid);

      if (updatedUser) {
        if (!updatedUser.participantInfo) {
          updatedUser.participantInfo = user;
        }

        if (mediaType === 'audio') {
          updatedUser.isMuted = !user.hasAudio;
          updatedUser.audioTrack = user.audioTrack;
        } else {
          updatedUser.cameraOff = !user.hasVideo;
          updatedUser.videoTrack = user.videoTrack;
        }
      }
    }),
    handleUserUnpublished(
      screenShareStore: AgoraScreenShareStoreInterface,
      user: IAgoraRTCRemoteUser,
      mediaType: 'audio' | 'video'
    ) {
      if (String(user?.uid).split('|')[0] === 'ss') {
        screenShareStore.handleUserUnpublished(user, mediaType);
        return;
      }

      const foundUser = self.speakers.find((remoteUser) => remoteUser.uid === user.uid);

      if (foundUser?.participantInfo) {
        if (mediaType === 'audio') {
          foundUser.audioTrack?.stop();
          foundUser.audioTrack = undefined;
          foundUser.isMuted = true;
        } else {
          foundUser.cameraOff = true;
          foundUser.videoTrack?.stop();
          foundUser.videoTrack = undefined;
        }
      }
    },
    handleUserJoined(user: IAgoraRTCRemoteUser) {
      if (String(user.uid).split('|')[0] === 'ss') {
        return;
      }

      const foundUser = self.speakers.find((remoteUser) => remoteUser.uid === user.uid);

      const newUser: AgoraRemoteUserInterface = cast({
        uid: user.uid,
        participantInfo: user,
        isMuted: true,
        cameraOff: true
      });

      if (!foundUser) {
        self.speakers = cast([...self.speakers, newUser]);
      }

      // TODO: Uncomment when whole infostructure is stable for Stage Mode
      // self.removeAudienceMember(String(user.uid));
    },
    handleUserLeft(user: IAgoraRTCRemoteUser) {
      if (String(user?.uid).split('|')[0] === 'ss') {
        return;
      }

      self.speakers = cast(self.speakers.filter((remoteUser) => remoteUser.uid !== user.uid));
      // TODO: Uncomment when whole infostructure is stable for Stage Mode
      // self.addAudienceMember(String(user.uid));
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

      self.speakers.forEach((remoteUser) => {
        const user = users.find((user) => remoteUser.uid === user.uid);
        remoteUser.soundLevel = user?.level ?? 0;
      });
    }
  }))
  // Listeners registration
  .actions((self) => ({
    setupAgoraListeners(screenShareStore: AgoraScreenShareStoreInterface) {
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

    createVideoTrackAndPublish: flow(function* (deviceId: string, isTrackEnabled: boolean) {
      if (self.client.connectionState !== 'CONNECTED') {
        return undefined;
      }

      const publishedCameraTrack: ICameraVideoTrack = yield AgoraRTC.createCameraVideoTrack({
        cameraId: deviceId,
        facingMode: 'user',
        // https://docs.agora.io/en/Agora%20Platform/video_profile_web_ng?platform=Web#recommended-video-profiles
        encoderConfig: '480p_1'
      });

      yield self.client.publish(publishedCameraTrack);
      yield publishedCameraTrack.setEnabled(isTrackEnabled);

      return publishedCameraTrack;
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
      const tokenResponse: string = yield self.tokenRequest.send(
        api.agoraRepository.getAgoraToken,
        {
          spaceId: spaceId ?? self.spaceId,
          isStageMode: true
        }
      );

      return tokenResponse;
    })
  }))
  // State actions
  .actions((self) => ({
    join: flow(function* (spaceId: string, authStateSubject: string) {
      self.isJoining = true;

      try {
        const stageModeResponse: StageModeJoinResponse = yield self.joinStageModeRequest.send(
          api.stageModeRepository.joinStageMode,
          {
            spaceId: spaceId
          }
        );

        yield self.client.setClientRole('audience');

        const tokenResponse = yield self.getAgoraToken(spaceId);

        self.userId = (yield self.client.join(
          self.appId,
          `stage-${spaceId}`,
          tokenResponse,
          authStateSubject
        )) as string;

        self.spaceId = spaceId;

        stageModeResponse.spaceIntegrationUsers
          // TODO: Decide on whether BE or Agora is the source of truth and remove or uncomment
          // ?.filter((user) => user.data.role !== 'speaker')
          ?.forEach((user) => self.addBackendUser(bytesToUuid(user.userId.data)));

        self.speakers = cast(
          self.client.remoteUsers.map((user) => ({
            uid: user.uid,
            participantInfo: user,
            isMuted: true,
            cameraOff: true
          }))
        );
      } finally {
        self.isJoining = false;
      }
    }),
    leave: flow(function* () {
      yield self.leaveStageModeRequest.send(api.stageModeRepository.leaveStageMode, {
        spaceId: self.spaceId
      });

      yield self.client.leave();
      self.isOnStage = false;
      self.spaceId = undefined;
      self.speakers = cast([]);
      self.backendUsers = cast([]);
    }),
    enterStage: flow(function* (
      createLocalTracks: (
        createAudioTrack: (
          deviceId: string,
          isTrackEnabled: boolean
        ) => Promise<IMicrophoneAudioTrack | undefined>,
        createVideoTrack: (
          deviceId: string,
          isTrackEnabled: boolean
        ) => Promise<ICameraVideoTrack | undefined>
      ) => Promise<void>
    ) {
      self.isTogglingIsOnStage = true;
      yield self.client.setClientRole('host');
      yield createLocalTracks(self.createAudioTrackAndPublish, self.createVideoTrackAndPublish);
      self.isOnStage = true;
      self.isTogglingIsOnStage = false;
    }),
    leaveStage: flow(function* () {
      self.isTogglingIsOnStage = true;
      self.client.localTracks.forEach((localTrack) => {
        localTrack.stop();
        localTrack.close();
      });

      yield self.client.unpublish();
      yield self.client.setClientRole('audience', {
        level: 1
      });

      self.isOnStage = false;
      self.isTogglingIsOnStage = false;
    })
  }))
  // Audience action
  .actions((self) => ({
    // TODO: To be removed when whole infostructure is stable for Stage Mode
    moveToAudience(userId: string) {
      self.backendUsers = cast([
        ...self.backendUsers,
        {uid: userId, role: ParticipantRoleEnum.AUDIENCE_MEMBER}
      ]);

      if (userId === self.userId) {
        self.leaveStage();
      }
    }
  }))
  // User actions
  .actions((self) => ({
    kickUserOffStage: flow(function* (userId: string) {
      // TODO: Replace with `if (!self.spaceId || userId === self.userId)` when whole infostructure
      // is stable for Stage Mode
      if (!self.spaceId) {
        return;
      }

      const isSuccess = yield self.stageModeKickRequest.send(api.stageModeRepository.admitOrKick, {
        spaceId: self.spaceId,
        userId,
        modType: ModerationEnum.KICK
      });

      if (!isSuccess) {
        return false;
      }

      // TODO: The whole if else block to be removed when whole infostructure is stable for Stage Mode
      if (userId === self.userId) {
        self.moveToAudience(userId);
      } else {
        yield self.leaveStage();
        self.moveToAudience(userId);
      }

      return true;
    }),
    requestToGoOnstageWasHandled() {
      self.requestWasMadeToGoOnStage = false;
    }
  }));

export {AgoraStageModeStore};
