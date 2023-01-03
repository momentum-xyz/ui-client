import {flow, types} from 'mobx-state-tree';
import AgoraRTC from 'agora-rtc-sdk-ng';
import {ResetModel} from '@momentum-xyz/core';

import {UserDevicesStore, AgoraVoiceChatStore, AgoraScreenShareStore} from './models';

const AgoraStore = types
  .compose(
    ResetModel,
    types.model('AgoraStore', {
      agoraVoiceChatStore: types.optional(AgoraVoiceChatStore, {}),
      agoraScreenShareStore: types.optional(AgoraScreenShareStore, {}),
      userDevicesStore: types.optional(UserDevicesStore, {})
    })
  )
  // Initializer
  .actions((self) => ({
    init(worldId: string, userId: string) {
      AgoraRTC.setLogLevel(4);

      self.userDevicesStore.init();
      self.agoraVoiceChatStore.init(worldId, userId);
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
      self.agoraVoiceChatStore.handleUserMuted(userId, self.userDevicesStore.mute);
    },
    handleAllMuted(initiatorId: string) {
      self.agoraVoiceChatStore.handleAllMuted(initiatorId, self.userDevicesStore.mute);
    }
  }))
  // Meeting space managment
  .actions((self) => ({
    joinVoiceChat: flow(function* () {
      self.setupAgoraListeners();

      yield self.agoraVoiceChatStore.join(self.userDevicesStore.createLocalTracks);

      self.userDevicesStore.mute();
    }),
    leaveVoiceChat: flow(function* () {
      self.userDevicesStore.cleanupLocalTracks();
      self.cleanupAgoraListeners();

      yield self.agoraVoiceChatStore.leave();
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
    get localSoundLevel(): number {
      return self.agoraVoiceChatStore.localSoundLevel;
    },
    get canToggleMicrophone(): boolean {
      return !self.userDevicesStore.isTogglingMicrophone && !!self.agoraVoiceChatStore.hasJoined;
    }
  }));

export {AgoraStore};
