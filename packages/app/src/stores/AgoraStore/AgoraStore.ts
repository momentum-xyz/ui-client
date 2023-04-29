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
  .actions((self) => ({
    initAgora(worldId: string, userId: string) {
      AgoraRTC.setLogLevel(4);
      self.userDevicesStore.init();
      self.agoraVoiceChatStore.initAgora(worldId, userId);
    },
    initUsers(worldId: string) {
      self.agoraVoiceChatStore.initUsers(worldId);
    }
  }))
  .actions((self) => ({
    joinVoiceChat: flow(function* () {
      self.agoraVoiceChatStore.setupAgoraListeners();
      const joined = yield self.agoraVoiceChatStore.join();
      if (!joined) {
        return;
      }

      self.userDevicesStore.createLocalTracks(self.agoraVoiceChatStore.createAudioTrackAndPublish);
      self.userDevicesStore.mute();
    }),
    leaveVoiceChat: flow(function* () {
      if (self.agoraVoiceChatStore.hasJoined) {
        yield self.userDevicesStore.cleanupLocalTracks();
        self.agoraVoiceChatStore.cleanupListeners();
        yield self.agoraVoiceChatStore.leave();
      }
    }),
    selectAudioInput(deviceId: string) {
      self.userDevicesStore.selectAudioInput(deviceId);

      if (self.agoraVoiceChatStore.hasJoined) {
        self.userDevicesStore.localAudioTrack?.stop();
        self.userDevicesStore.localAudioTrack?.close();

        if (self.userDevicesStore.localAudioTrack) {
          self.agoraVoiceChatStore.client.unpublish(self.userDevicesStore.localAudioTrack);
        }

        self.userDevicesStore.createLocalAudioTrack(
          self.agoraVoiceChatStore.createAudioTrackAndPublish
        );
      }
    },
    selectAudioOutput(deviceId: string) {
      self.userDevicesStore.selectAudioOutput(deviceId);

      if (self.agoraVoiceChatStore.hasJoined) {
        // TODO: Implementation
      }
    }
  }))
  .views((self) => ({
    get localSoundLevel(): number {
      return self.agoraVoiceChatStore.localSoundLevel;
    },
    get canToggleMicrophone(): boolean {
      return !self.userDevicesStore.isTogglingMicrophone && !!self.agoraVoiceChatStore.hasJoined;
    },
    get hasJoined(): boolean {
      return self.agoraVoiceChatStore.hasJoined;
    }
  }));

export {AgoraStore};
