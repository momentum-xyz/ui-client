import {flow, types} from 'mobx-state-tree';
import AgoraRTC from 'agora-rtc-sdk-ng';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api} from 'api';
import {appVariables} from 'api/constants';
import {SpaceIntegrationsStageModeResponse} from 'api/repositories/spaceIntegrationsRepository/spaceIntegrations.api.types';

import {UserDevicesStore} from './UserDevicesStore';
import {AgoraMeetingStore} from './AgoraMeetingStore';
import {AgoraStageModeStore} from './AgoraStageModeStore';
import {AgoraScreenShareStore} from './AgoraScreenShareStore';

const AgoraStore = types
  .compose(
    ResetModel,
    types.model('AgoraStore', {
      agoraMeetingStore: types.optional(AgoraMeetingStore, {}),
      agoraStageModeStore: types.optional(AgoraStageModeStore, {}),
      agoraScreenShareStore: types.optional(AgoraScreenShareStore, {}),
      userDevicesStore: types.optional(UserDevicesStore, {}),

      // Common
      appId: '',
      userId: types.maybe(types.string),
      spaceId: types.maybe(types.string),
      isStageMode: false,
      isTogglingStageMode: false,
      currentUserToggledStageMode: false,

      // Requests
      spaceIntegrationsRequest: types.optional(RequestModel, {}),
      toggleStageModeRequest: types.optional(RequestModel, {})
    })
  )
  // API Requests
  .actions((self) => ({
    getStageModeStatus: flow(function* (spaceId?: string) {
      return yield self.spaceIntegrationsRequest.send(
        api.spaceIntegrationsRepository.fetchStageModeStatus,
        {spaceId: spaceId || self.spaceId || ''}
      );
    })
  }))
  // Initializer
  .actions((self) => ({
    init() {
      AgoraRTC.setLogLevel(4);
      self.userDevicesStore.init();
      self.appId = appVariables.AGORA_APP_ID;

      self.agoraStageModeStore.init(self.appId);
      self.agoraMeetingStore.init(self.appId);
    }
  }))
  // Agora calls setups and chat toggle
  .actions((self) => ({
    // --- COMMON ---
    setupAgoraListeners() {
      if (self.isStageMode) {
        self.agoraStageModeStore.setupAgoraListeners(self.agoraScreenShareStore);
      } else {
        self.agoraMeetingStore.setupAgoraListeners(self.agoraScreenShareStore);
      }
    },
    cleanupAgoraListeners() {
      if (self.isStageMode) {
        self.agoraStageModeStore.cleanupListeners();
      } else {
        self.agoraMeetingStore.cleanupListeners();
      }
    }
  }))
  // Meeting space managment
  .actions((self) => ({
    join: flow(function* (authStateSubject: string, spaceId?: string, isToggling = false) {
      if (!isToggling) {
        self.init();
        self.agoraStageModeStore.init(self.appId);
        self.agoraMeetingStore.init(self.appId);
      }

      const status: SpaceIntegrationsStageModeResponse | undefined = yield self.getStageModeStatus(
        spaceId
      );

      self.isStageMode = status?.data?.stageModeStatus === 'initiated';
      self.setupAgoraListeners();

      if (self.isStageMode) {
        if (self.agoraMeetingStore.joined) {
          self.userDevicesStore.cleanupLocalTracks();
          self.agoraScreenShareStore.leave();
          yield self.agoraMeetingStore.leave();
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
        }

        if (!self.spaceId && !spaceId) {
          return;
        }

        if (spaceId) {
          yield self.agoraMeetingStore.join(
            spaceId,
            authStateSubject,
            self.userDevicesStore.createLocalTracks
          );
        } else if (self.spaceId) {
          yield self.agoraMeetingStore.join(
            self.spaceId,
            authStateSubject,
            self.userDevicesStore.createLocalTracks
          );
        }
      }

      self.userDevicesStore.mute();
      self.userDevicesStore.turnOffCamera();

      if (spaceId) {
        self.spaceId = spaceId;
      }

      self.agoraScreenShareStore.init(self.appId, self.isStageMode, self.spaceId);
    }),
    leave: flow(function* () {
      self.userDevicesStore.cleanupLocalTracks();
      self.cleanupAgoraListeners();

      if (self.isStageMode) {
        yield self.agoraStageModeStore.leave();
      } else {
        yield self.agoraMeetingStore.leave();
      }

      self.agoraScreenShareStore.leave();

      self.agoraStageModeStore.resetModel();
      self.agoraMeetingStore.resetModel();
      self.agoraScreenShareStore.resetModel();
      self.resetModel();
    })
  }))
  // Stage mode actions
  .actions((self) => ({
    toggleStageMode: flow(function* (userId: string) {
      if (!self.spaceId) {
        return;
      }

      self.isTogglingStageMode = true;
      self.currentUserToggledStageMode = true;

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
    toggledStageMode: flow(function* (user: string, isModerator = true) {
      yield self.join(user, undefined, true);

      self.isTogglingStageMode = false;

      if (!self.isStageMode) {
        self.currentUserToggledStageMode = false;
        return false;
      }

      if (
        isModerator &&
        self.agoraStageModeStore.canEnterStage &&
        self.currentUserToggledStageMode
      ) {
        yield self.agoraStageModeStore.enterStage(self.userDevicesStore.createLocalTracks);
        self.currentUserToggledStageMode = false;
        return false;
      } else if (isModerator && self.currentUserToggledStageMode) {
        self.currentUserToggledStageMode = false;
        return true;
      }

      self.currentUserToggledStageMode = false;
      return false;
    })
  }))
  .actions((self) => ({
    selectAudioInput(deviceId: string) {
      self.userDevicesStore.selectAudioInput(deviceId);

      self.userDevicesStore.localAudioTrack?.stop();
      self.userDevicesStore.localAudioTrack?.close();

      const store = self.isStageMode ? self.agoraStageModeStore : self.agoraMeetingStore;

      if (self.userDevicesStore.localAudioTrack) {
        store.client.unpublish(self.userDevicesStore.localAudioTrack);
      }

      self.userDevicesStore.createLocalAudioTrack(store.createAudioTrackAndPublish);
    },
    selectVideoInput(deviceId: string) {
      self.userDevicesStore.selectVideoInput(deviceId);

      self.userDevicesStore.localVideoTrack?.stop();
      self.userDevicesStore.localVideoTrack?.close();

      const store = self.isStageMode ? self.agoraStageModeStore : self.agoraMeetingStore;

      if (self.userDevicesStore.localVideoTrack) {
        store.client.unpublish(self.userDevicesStore.localVideoTrack);
      }

      self.userDevicesStore.createLocalVideoTrack(store.createVideoTrackAndPublish);
    }
  }))
  .views((self) => ({
    get hasJoined(): boolean {
      return self.spaceId !== undefined;
    },
    get meetingPeopleCount(): number {
      return self.isStageMode
        ? self.agoraStageModeStore.numberOfAudienceMembers
        : self.agoraMeetingStore.users.length + 1;
    },
    get userIds(): string[] {
      return self.isStageMode
        ? [
            ...self.agoraStageModeStore.speakers.map((user) => user.uid.toString()),
            ...self.agoraStageModeStore.backendUsers.map((user) => user.uid.toString())
          ]
        : self.agoraMeetingStore.users.map((user) => user.uid.toString());
    },
    get localSoundLevel(): number {
      return self.isStageMode
        ? self.agoraStageModeStore.localSoundLevel
        : self.agoraMeetingStore.localSoundLevel;
    },
    get canToggleMicrophone(): boolean {
      return (
        !self.userDevicesStore.isTogglingMicrophone &&
        (self.isStageMode ? self.agoraStageModeStore.isOnStage : !!self.agoraMeetingStore.spaceId)
      );
    },
    get canToggleCamera(): boolean {
      return (
        !self.userDevicesStore.isTogglingCamera &&
        (self.isStageMode
          ? self.agoraStageModeStore.isOnStage
          : !!self.agoraMeetingStore.spaceId && !self.agoraMeetingStore.maxVideoStreamsReached)
      );
    }
  }));

export {AgoraStore};
