import {flow, Instance, types, cast} from 'mobx-state-tree';
import AgoraRTC, {
  ConnectionDisconnectedReason,
  ConnectionState,
  IAgoraRTCRemoteUser
} from 'agora-rtc-sdk-ng';

import {ResetModel, RequestModel} from 'core/models';
import {appVariables} from 'api/constants';
import {api} from 'api';
import {SpaceIntegrationsStageModeResponse} from 'api/repositories/spaceIntegrationsRepository/spaceIntegrations.api.types';

import {AgoraRemoteUser, AgoraRemoteUserInterface, UserDevicesStore} from './models';
import {VideoCallStore} from './VideoCallStore';
import {StageModeStore} from './StageModeStore';
import {ScreenShareStore} from './ScreenshareStore';

const AgoraStore = types
  .compose(
    ResetModel,
    types.model('AgoraStore', {
      // stores
      videoCallStore: types.optional(VideoCallStore, {}),
      stageModeStore: types.optional(StageModeStore, {}),
      screenShareStore: types.optional(ScreenShareStore, {}),

      // Common
      appId: '',
      userId: types.maybe(types.string),
      spaceId: types.maybe(types.string),
      userDevicesStore: types.optional(UserDevicesStore, {}),
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
        yield self.stageModeStore.muteRemoteUser(userId);
      } else {
        yield self.videoCallStore.muteRemoteUser(userId);
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
            self.isStageMode ? self.stageModeStore.client : self.videoCallStore.client
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
        yield self.videoCallStore.client.subscribe(user, mediaType);
        if (user.videoTrack) {
          self.screenShareStore.screenShareStarted(user.videoTrack);
        }
      }
    }),
    handleUserUnpublished: flow(function* (
      user: IAgoraRTCRemoteUser,
      mediaType: 'audio' | 'video'
    ) {
      const isScreenshare = (user?.uid as string).split('|')[0] === 'ss';

      if (isScreenshare) {
        self.screenShareStore.client = undefined;
      } else {
        const foundUser = self.remoteUsers.find((remoteUser) => remoteUser.uid === user.uid);

        if (foundUser?.participantInfo) {
          if (mediaType === 'audio' && foundUser.audioTrack?.isPlaying) {
            foundUser.audioTrack?.stop();
          }

          yield (
            self.isStageMode ? self.stageModeStore.client : self.videoCallStore.client
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
        self.screenShareStore.screenShareStopped();
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

      self.stageModeStore.init(self.appId);
      self.videoCallStore.init(self.appId);
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
        self.stageModeStore.client.on('user-published', self.handleUserPublished);
        self.stageModeStore.client.on('user-unpublished', self.handleUserPublished);
        self.stageModeStore.client.on('user-joined', self.handleUserJoined);
        self.stageModeStore.client.on('user-left', self.handleUserLeft);
        self.stageModeStore.client.on('connection-state-change', self.handleConnectionStateChange);
        self.stageModeStore.client.on('volume-indicator', self.handleVolumeIndicator);
      } else {
        self.videoCallStore.client.on('user-published', self.handleUserPublished);
        self.videoCallStore.client.on('user-unpublished', self.handleUserPublished);
        self.videoCallStore.client.on('user-joined', self.handleUserJoined);
        self.videoCallStore.client.on('user-left', self.handleUserLeft);
        self.videoCallStore.client.on('connection-state-change', self.handleConnectionStateChange);
        self.videoCallStore.client.on('volume-indicator', self.handleVolumeIndicator);
      }
    },
    clanupAgoraListeners() {
      if (self.isStageMode) {
        self.stageModeStore.clanupListeners();
      } else {
        self.videoCallStore.clanupListeners();
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
        if (self.videoCallStore.joined) {
          self.userDevicesStore.cleanupLocalTracks();
          self.screenShareStore.stopScreenShare();
          yield self.videoCallStore.leave();
          self.remoteUsers = cast([]);
        }

        if (!self.spaceId && !spaceId) {
          return;
        }

        if (spaceId) {
          yield self.stageModeStore.join(spaceId, authStateSubject);
        } else if (self.spaceId) {
          yield self.stageModeStore.join(self.spaceId, authStateSubject);
        }
      } else {
        if (self.stageModeStore.joined) {
          self.userDevicesStore.cleanupLocalTracks();
          yield self.stageModeStore.leave();
          self.remoteUsers = cast([]);
        }

        if (!self.spaceId && !spaceId) {
          return;
        }

        if (spaceId) {
          yield self.videoCallStore.join(
            spaceId,
            authStateSubject,
            self.userDevicesStore.createLocalTracks
          );
        } else if (self.spaceId) {
          yield self.videoCallStore.join(
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
      self.screenShareStore.init(self.appId, isStageMode, self.spaceId);
    }),
    leaveMeetingSpace: flow(function* () {
      self.userDevicesStore.cleanupLocalTracks();

      if (self.isStageMode) {
        yield self.stageModeStore.leave();
      } else {
        self.screenShareStore.stopScreenShare();
        yield self.videoCallStore.leave();
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
    toggledStageMode: flow(function* (user: string) {
      yield self.joinMeetingSpace(user);
      self.isTogglingStageMode = false;
    })
  }))
  .views((self) => ({
    get hasJoined(): boolean {
      return self.spaceId !== undefined;
    }
  }));

export interface AgoraStoreInterface extends Instance<typeof AgoraStore> {}

export {AgoraStore};
