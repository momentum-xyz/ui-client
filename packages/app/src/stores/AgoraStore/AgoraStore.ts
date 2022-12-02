import {flow, types} from 'mobx-state-tree';
import AgoraRTC from 'agora-rtc-sdk-ng';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api} from 'api';
import {appVariables} from 'api/constants';

import {UserDevicesStore} from './UserDevicesStore';
import {AgoraVoiceChatStore} from './AgoraVoiceChatStore';
import {AgoraScreenShareStore} from './AgoraScreenShareStore';

const AgoraStore = types
  .compose(
    ResetModel,
    types.model('AgoraStore', {
      agoraVoiceChatStore: types.optional(AgoraVoiceChatStore, {}),
      agoraScreenShareStore: types.optional(AgoraScreenShareStore, {}),
      userDevicesStore: types.optional(UserDevicesStore, {}),

      // Common
      appId: '',
      userId: types.maybe(types.string),
      worldId: types.maybe(types.string),
      isTogglingStageMode: false,
      currentUserToggledStageMode: false,

      // Requests
      spaceIntegrationsRequest: types.optional(RequestModel, {}),
      toggleStageModeRequest: types.optional(RequestModel, {})
    })
  )
  // Initializer
  .actions((self) => ({
    init() {
      AgoraRTC.setLogLevel(4);
      self.userDevicesStore.init();
      self.appId = appVariables.AGORA_APP_ID;

      self.agoraVoiceChatStore.init(self.appId);
    }
  }))
  // Agora calls setups and chat toggle
  .actions((self) => ({
    // --- COMMON ---
    setupAgoraListeners() {
      self.agoraVoiceChatStore.setupAgoraListeners(self.agoraScreenShareStore);
    },
    cleanupAgoraListeners() {
      self.agoraVoiceChatStore.cleanupListeners();
    },
    handleUserMuted(userId: string) {
      console.info('[AgoraStore] User muted', userId);
      if (userId === self.userId) {
        self.userDevicesStore.mute();
      }
    }
  }))
  // Meeting space managment
  .actions((self) => ({
    join: flow(function* (authStateSubject: string, worldId?: string, isToggling = false) {
      if (!self.worldId && !worldId) {
        return;
      }

      if (!isToggling) {
        self.init();
        self.agoraVoiceChatStore.init(self.appId);
      }

      self.setupAgoraListeners();

      if (worldId) {
        yield self.agoraVoiceChatStore.join(
          worldId,
          authStateSubject,
          self.userDevicesStore.createLocalTracks
        );
        self.worldId = worldId;
      } else if (self.worldId) {
        yield self.agoraVoiceChatStore.join(
          self.worldId,
          authStateSubject,
          self.userDevicesStore.createLocalTracks
        );
      }

      self.userDevicesStore.mute();

      // self.agoraScreenShareStore.init(self.appId, self.worldId);
    }),
    leave: flow(function* () {
      self.userDevicesStore.cleanupLocalTracks();
      self.cleanupAgoraListeners();

      yield self.agoraVoiceChatStore.leave();

      // self.agoraScreenShareStore.leave();

      self.agoraVoiceChatStore.resetModel();
      // self.agoraScreenShareStore.resetModel();
      self.resetModel();
    })
  }))
  // Stage mode actions
  .actions((self) => ({
    toggleStageMode: flow(function* (userId: string) {
      if (!self.worldId) {
        return;
      }

      self.isTogglingStageMode = true;
      self.currentUserToggledStageMode = true;

      yield self.toggleStageModeRequest.send(api.spaceIntegrationsRepository.enableStageMode, {
        spaceId: self.worldId,
        userId
      });
    })
  }))
  .actions((self) => ({
    selectAudioInput(deviceId: string) {
      self.userDevicesStore.selectAudioInput(deviceId);

      self.userDevicesStore.localAudioTrack?.stop();
      self.userDevicesStore.localAudioTrack?.close();

      if (self.userDevicesStore.localAudioTrack) {
        self.agoraVoiceChatStore.client.unpublish(self.userDevicesStore.localAudioTrack);
      }

      self.userDevicesStore.createLocalAudioTrack(
        self.agoraVoiceChatStore.createAudioTrackAndPublish
      );
    },
    selectVideoInput(deviceId: string) {
      self.userDevicesStore.selectVideoInput(deviceId);
    }
  }))
  .views((self) => ({
    get hasJoined(): boolean {
      return self.worldId !== undefined;
    },
    get meetingPeopleCount(): number {
      return self.agoraVoiceChatStore.agoraRemoteUsers.length + 1;
    },
    get userIds(): string[] {
      return self.agoraVoiceChatStore.agoraRemoteUsers.map((user) => user.uid.toString());
    },
    get localSoundLevel(): number {
      return self.agoraVoiceChatStore.localSoundLevel;
    },
    get canToggleMicrophone(): boolean {
      return !self.userDevicesStore.isTogglingMicrophone && !!self.agoraVoiceChatStore.worldId;
    },
    get canToggleCamera(): boolean {
      return !self.userDevicesStore.isTogglingCamera && !!self.agoraVoiceChatStore.worldId;
    }
  }));

export {AgoraStore};
