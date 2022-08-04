import {flow, Instance, types, cast} from 'mobx-state-tree';
import AgoraRTC, {
  ConnectionDisconnectedReason,
  ConnectionState,
  IAgoraRTCRemoteUser
} from 'agora-rtc-sdk-ng';

import {api} from 'api';
import {appVariables} from 'api/constants';
import {ResetModel, RequestModel, AgoraRemoteUser, AgoraRemoteUserInterface} from 'core/models';
import {SpaceIntegrationsStageModeResponse} from 'api/repositories/spaceIntegrationsRepository/spaceIntegrations.api.types';

import {UserDevicesStore} from './UserDevicesStore';
import {VideoCallStore} from './AgoraVideoCallStore';
import {AgoraStageModeStore} from './AgoraStageModeStore';
import {AgoraScreenShareStore} from './AgoraScreenShareStore';

const AgoraStore = types
  .compose(
    ResetModel,
    types.model('AgoraStore', {
      // stores
      userDevicesStore: types.optional(UserDevicesStore, {}),
      agoraVideoCallStore: types.optional(VideoCallStore, {}),
      agoraStageModeStore: types.optional(AgoraStageModeStore, {}),
      agoraScreenShareStore: types.optional(AgoraScreenShareStore, {}),

      // Common
      appId: '',
      userId: types.maybe(types.string),
      spaceId: types.maybe(types.string),
      remoteUsers: types.optional(types.array(AgoraRemoteUser), []),
      isStageMode: false,
      isTogglingStageMode: false,
      localSoundLevel: 0,
      connectionState: types.optional(types.frozen<ConnectionState>(), 'DISCONNECTED'),

      // Chat
      isChatOpen: false,

      // Requests
      spaceIntegrationsRequest: types.optional(RequestModel, {}),
      toggleStageModeRequest: types.optional(RequestModel, {})
    })
  )
  // API Requests
  .actions((self) => ({
    getStageModeStatus: flow(function* (spaceId?: string) {
      const status: SpaceIntegrationsStageModeResponse = yield self.spaceIntegrationsRequest.send(
        api.spaceIntegrationsRepository.fetchStageModeStatus,
        {spaceId: spaceId ?? self.spaceId}
      );

      return status;
    }),
    muteRemoteUser: flow(function* (userId: string) {
      if (!self.spaceId) {
        return;
      }

      if (self.isStageMode) {
        yield self.agoraStageModeStore.muteRemoteUser(userId);
      } else {
        yield self.agoraVideoCallStore.muteRemoteUser(userId);
      }
    })
  }))
  // Listeners for Agora Client
  .actions((self) => ({
    handleUserPublished: flow(function* (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') {
      const isScreenshare = (user?.uid as string).split('|')[0] === 'ss';

      if (!isScreenshare) {
        if ((user.hasAudio && mediaType === 'audio') || (user.hasVideo && mediaType === 'video')) {
          yield (
            self.isStageMode ? self.agoraStageModeStore.client : self.agoraVideoCallStore.client
          ).subscribe(user, mediaType);
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
        yield self.agoraVideoCallStore.client.subscribe(user, mediaType);
        if (user.videoTrack) {
          self.agoraScreenShareStore.screenShareStarted(user.videoTrack);
        }
      }
    }),
    handleUserUnpublished: flow(function* (
      user: IAgoraRTCRemoteUser,
      mediaType: 'audio' | 'video'
    ) {
      const isScreenshare = (user?.uid as string).split('|')[0] === 'ss';

      if (isScreenshare) {
        self.agoraScreenShareStore.client = undefined;
      } else {
        const foundUser = self.remoteUsers.find((remoteUser) => remoteUser.uid === user.uid);

        if (foundUser?.participantInfo) {
          if (mediaType === 'audio' && foundUser.audioTrack?.isPlaying) {
            foundUser.audioTrack?.stop();
          }

          yield (
            self.isStageMode ? self.agoraStageModeStore.client : self.agoraVideoCallStore.client
          ).unsubscribe(foundUser.participantInfo, mediaType);

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
        self.agoraScreenShareStore.screenShareStopped();
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
  // Initializer
  .actions((self) => ({
    init() {
      AgoraRTC.setLogLevel(4);
      self.userDevicesStore.init();
      self.appId = appVariables.AGORA_APP_ID;

      self.agoraStageModeStore.init(self.appId);
      self.agoraVideoCallStore.init(self.appId);
    }
  }))
  // Chat visibility
  .actions((self) => ({
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
        self.agoraStageModeStore.client.on('user-published', self.handleUserPublished);
        self.agoraStageModeStore.client.on('user-unpublished', self.handleUserPublished);
        self.agoraStageModeStore.client.on('user-joined', self.handleUserJoined);
        self.agoraStageModeStore.client.on('user-left', self.handleUserLeft);
        self.agoraStageModeStore.client.on(
          'connection-state-change',
          self.handleConnectionStateChange
        );
        self.agoraStageModeStore.client.on('volume-indicator', self.handleVolumeIndicator);
      } else {
        self.agoraVideoCallStore.client.on('user-published', self.handleUserPublished);
        self.agoraVideoCallStore.client.on('user-unpublished', self.handleUserPublished);
        self.agoraVideoCallStore.client.on('user-joined', self.handleUserJoined);
        self.agoraVideoCallStore.client.on('user-left', self.handleUserLeft);
        self.agoraVideoCallStore.client.on(
          'connection-state-change',
          self.handleConnectionStateChange
        );
        self.agoraVideoCallStore.client.on('volume-indicator', self.handleVolumeIndicator);
      }
    },
    clanupAgoraListeners() {
      if (self.isStageMode) {
        self.agoraStageModeStore.clanupListeners();
      } else {
        self.agoraVideoCallStore.clanupListeners();
      }
    },

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
        if (self.agoraVideoCallStore.joined) {
          self.userDevicesStore.cleanupLocalTracks();
          self.agoraScreenShareStore.stopScreenShare();
          yield self.agoraVideoCallStore.leave();
          self.remoteUsers = cast([]);
        }

        if (!self.spaceId && !spaceId) {
          return;
        }

        if (spaceId) {
          yield self.agoraStageModeStore.join(spaceId, authStateSubject);
        } else if (self.spaceId) {
          yield self.agoraStageModeStore.join(self.spaceId, authStateSubject);
        }
      } else {
        if (self.agoraStageModeStore.joined) {
          self.userDevicesStore.cleanupLocalTracks();
          yield self.agoraStageModeStore.leave();
          self.remoteUsers = cast([]);
        }

        if (!self.spaceId && !spaceId) {
          return;
        }

        if (spaceId) {
          yield self.agoraVideoCallStore.join(
            spaceId,
            authStateSubject,
            self.userDevicesStore.createLocalTracks
          );
        } else if (self.spaceId) {
          yield self.agoraVideoCallStore.join(
            self.spaceId,
            authStateSubject,
            self.userDevicesStore.createLocalTracks
          );
        }
      }

      if (spaceId) {
        self.spaceId = spaceId;
      }

      self.setupAgoraListeners();
      self.isStageMode = isStageMode;
      self.agoraScreenShareStore.init(self.appId, isStageMode, self.spaceId);
    }),
    leaveMeetingSpace: flow(function* () {
      self.userDevicesStore.cleanupLocalTracks();

      if (self.isStageMode) {
        yield self.agoraStageModeStore.leave();
      } else {
        self.agoraScreenShareStore.stopScreenShare();
        yield self.agoraVideoCallStore.leave();
      }

      self.remoteUsers = cast([]);
      self.spaceId = undefined;
    })
  }))
  // Stage mode actions
  .actions((self) => ({
    toggleStageMode: flow(function* (userId: string) {
      if (!self.spaceId) {
        return;
      }

      self.isTogglingStageMode = true;

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
    /**
     * @returns {boolean} Boolean whether should show stage is full error
     */
    toggledStageMode: flow(function* (user: string, isModerator = true) {
      yield self.joinMeetingSpace(user);

      self.isTogglingStageMode = false;

      if (isModerator && self.agoraStageModeStore.canEnterStage) {
        yield self.agoraStageModeStore.enterStage(self.userDevicesStore.createLocalTracks);
        return false;
      } else if (isModerator) {
        return true;
      }

      return false;
    })
  }))
  .views((self) => ({
    get hasJoined(): boolean {
      return self.spaceId !== undefined;
    },
    get maxVideoStreamsReached(): boolean {
      return self.remoteUsers.length + 1 > appVariables.PARTICIPANTS_VIDEO_LIMIT;
    }
  }));

export interface AgoraStoreInterface extends Instance<typeof AgoraStore> {}

export {AgoraStore};
