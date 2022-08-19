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
import {StageModeJoinResponse} from 'api/repositories/stageModeRepository/stageModeRepository.api.types';
import {api} from 'api';
import {bytesToUuid} from 'core/utils';
import {ModerationEnum, ParticipantRole, StageModeRequestEnum} from 'core/enums';
import {appVariables} from 'api/constants';
import {AgoraScreenShareStoreInterface} from 'stores/MainStore/models/AgoraStore/AgoraScreenShareStore';

const AgoraStageModeStore = types
  .compose(
    ResetModel,
    types.model('AgoraStageModeStore', {
      appId: '',
      spaceId: types.maybe(types.string),
      userId: types.maybe(types.string),
      toggledStageMode: false,
      isOnStage: false,
      isLowQualityModeEnabled: false,
      requestWasMadeToGoOnStage: false,
      audience: types.optional(types.array(StageModeUser), []),
      users: types.optional(types.array(AgoraRemoteUser), []),
      localSoundLevel: 0,
      connectionState: types.optional(types.frozen<ConnectionState>(), 'DISCONNECTED'),

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
    get audienceMembers(): StageModeUserInterface[] {
      return self.audience.filter((user) => {
        return user.role === ParticipantRole.AUDIENCE_MEMBER && user.uid !== self.userId;
      });
    }
  }))
  .views((self) => ({
    get joined(): boolean {
      return self.spaceId !== undefined;
    },
    get canEnterStage(): boolean {
      return (
        self.client.remoteUsers.length + (self.isOnStage ? 1 : 0) < appVariables.MAX_STAGE_USERS
      );
    },
    get numberOfSpeakers(): number {
      return self.client.remoteUsers.length + (self.isOnStage ? 1 : 0);
    },
    get numberOfAudienceMembers(): number {
      return self.audienceMembers.length + Number(!self.isOnStage);
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
  // Listeners handlers
  .actions((self) => ({
    handleUserPublished: flow(function* (
      screenShareStore: AgoraScreenShareStoreInterface,
      user: IAgoraRTCRemoteUser,
      mediaType: 'audio' | 'video'
    ) {
      if ((user?.uid as string).split('|')[0] === 'ss') {
        yield self.client.subscribe(user, mediaType);
        screenShareStore.handleUserPublished(user, mediaType);
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
      screenShareStore: AgoraScreenShareStoreInterface,
      user: IAgoraRTCRemoteUser,
      mediaType: 'audio' | 'video'
    ) {
      if ((user?.uid as string).split('|')[0] === 'ss') {
        screenShareStore.handleUserUnpublished(user, mediaType);
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

      self.audience = cast(
        stageModeResponse.spaceIntegrationUsers
          ?.filter((user) => user.data.role !== 'speaker')
          .map((user) => ({
            uid: bytesToUuid(user.userId.data),
            role: ParticipantRole.AUDIENCE_MEMBER
          }))
      );
    }),
    leave: flow(function* () {
      yield self.leaveStageModeRequest.send(api.stageModeRepository.leaveStageMode, {
        spaceId: self.spaceId
      });

      yield self.client.leave();
      self.isOnStage = false;
      self.spaceId = undefined;
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
      ) => void
    ) {
      yield self.client.setClientRole('host');
      createLocalTracks(self.createAudioTrackAndPublish, self.createVideoTrackAndPublish);
      self.isOnStage = true;
    }),
    leaveStage: flow(function* () {
      self.client.localTracks.forEach((localTrack) => {
        localTrack.setEnabled(false);
        localTrack.stop();
      });

      yield self.client.unpublish();
      self.isOnStage = false;
      yield self.client.setClientRole('audience', {
        level: 1
      });
    })
  }))
  // Audience action
  .actions((self) => ({
    moveToAudience(userId: string) {
      self.audience = cast([
        ...self.audience,
        {uid: userId, role: ParticipantRole.AUDIENCE_MEMBER}
      ]);

      if (userId === self.userId) {
        self.leaveStage();
      }
    }
  }))
  // User actions
  .actions((self) => ({
    kickUserOffStage: flow(function* (userId: string) {
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

      if (userId === self.userId) {
        self.moveToAudience(userId);
      } else {
        yield self.leaveStage();
        self.moveToAudience(userId);
      }

      return true;
    }),
    addStageModeUser(userId: string) {
      if (self.audience.filter((user) => user.uid === userId).length !== 0) {
        return;
      }

      self.audience.push({
        uid: userId,
        role: ParticipantRole.AUDIENCE_MEMBER
      });
    },
    removeStageModeUser(userId: string) {
      self.audience = cast(self.audience.filter((user) => user.uid !== userId));
    },
    requestToGoOnstageWasHandled() {
      self.requestWasMadeToGoOnStage = false;
    }
  }));

export {AgoraStageModeStore};
