import {flow, types, cast} from 'mobx-state-tree';
import AgoraRTC, {ILocalAudioTrack, ILocalVideoTrack} from 'agora-rtc-sdk-ng';

import {RequestModel, ResetModel, StageModeUser} from 'core/models';
import {StageModeJoinResponse} from 'api/repositories/stageModeRepository/stageModeRepository.api.types';
import {api} from 'api';
import {bytesToUuid} from 'core/utils';
import {ModerationEnum, ParticipantRole, StageModeRequestEnum} from 'core/enums';
import {appVariables} from 'api/constants';

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
      users: types.optional(types.array(StageModeUser), []),
      requestWasMadeToGoOnStage: false,

      // Requests
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
    client: AgoraRTC.createClient({mode: 'live', codec: 'vp8'})
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
  // Common actions
  .actions((self) => ({
    init(appId: string) {
      self.client.enableDualStream();
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

      const publishedAudioTrack = yield AgoraRTC.createMicrophoneAudioTrack({
        microphoneId: deviceId
      });

      yield self.client.publish(publishedAudioTrack);
      publishedAudioTrack.setEnabled(isTrackEnabled);

      return publishedAudioTrack;
    }),
    clanupListeners() {
      self.client.removeAllListeners();
    },
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
      self.users = cast(
        stageModeResponse.spaceIntegrationUsers?.map((user) => ({
          uid: bytesToUuid(user.userId.data),
          role:
            user.data.role === 'speaker' ? ParticipantRole.SPEAKER : ParticipantRole.AUDIENCE_MEMBER
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
        ) => Promise<ILocalAudioTrack | undefined>,
        createVideoTrack: (
          deviceId: string,
          isTrackEnabled: boolean
        ) => Promise<ILocalVideoTrack | undefined>
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
      const userToBeMoved = self.users.find((user) => user.uid === userId);

      if (userToBeMoved) {
        userToBeMoved.role = ParticipantRole.AUDIENCE_MEMBER;
      }

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
      if (self.users.filter((user) => user.uid === userId).length !== 0) {
        return;
      }

      self.users.push({
        uid: userId,
        role: ParticipantRole.AUDIENCE_MEMBER
      });
    },
    removeStageModeUser(userId: string) {
      self.users = cast(self.users.filter((user) => user.uid !== userId));
    },
    requestToGoOnstageWasHandled() {
      self.requestWasMadeToGoOnStage = false;
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
      return (
        self.users.filter((user) => user.role === ParticipantRole.AUDIENCE_MEMBER).length -
        (self.isOnStage ? 1 : 0)
      );
    }
  }));

export {AgoraStageModeStore};
