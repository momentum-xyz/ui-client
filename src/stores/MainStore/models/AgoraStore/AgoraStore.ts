import {flow, types, cast} from 'mobx-state-tree';
import AgoraRTC from 'agora-rtc-sdk-ng';

import {api} from 'api';
import {appVariables} from 'api/constants';
import {ResetModel, RequestModel} from 'core/models';
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
    })
  }))
  // Initializer
  .actions((self) => ({
    init() {
      AgoraRTC.setLogLevel(4);
      self.userDevicesStore.init();
      self.appId = appVariables.AGORA_APP_ID;
    }
  }))
  // Agora calls setups and chat toggle
  .actions((self) => ({
    // --- COMMON ---
    setupAgoraListeners() {
      if (self.isStageMode) {
        self.agoraStageModeStore.setupAgoraListeners();
      } else {
        self.agoraMeetingStore.setupAgoraListeners();
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
    joinMeetingSpace: flow(function* (authStateSubject: string, spaceId?: string) {
      self.init();
      self.agoraStageModeStore.init(self.appId);
      self.agoraMeetingStore.init(self.appId);

      const status: SpaceIntegrationsStageModeResponse = yield self.getStageModeStatus(spaceId);

      const isStageMode = status.data?.stageModeStatus === 'initiated';

      if (isStageMode) {
        if (self.agoraMeetingStore.joined) {
          self.userDevicesStore.cleanupLocalTracks();
          self.agoraScreenShareStore.leave();
          yield self.agoraMeetingStore.leave();
          self.agoraMeetingStore.users = cast([]);
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
          self.agoraMeetingStore.users = cast([]);
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

      if (spaceId) {
        self.spaceId = spaceId;
      }

      self.setupAgoraListeners();
      self.isStageMode = isStageMode;
      self.agoraScreenShareStore.init(self.appId, isStageMode, self.spaceId);
      self.agoraScreenShareStore.join(authStateSubject);
    }),
    leaveMeetingSpace: flow(function* () {
      self.userDevicesStore.cleanupLocalTracks();
      self.cleanupAgoraListeners();

      if (self.isStageMode) {
        yield self.agoraStageModeStore.leave();
      } else {
        self.agoraScreenShareStore.leave();
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
    get meetingPeopleCount(): number {
      return self.isStageMode
        ? self.agoraStageModeStore.numberOfAudienceMembers
        : self.agoraMeetingStore.users.length + 1;
    },
    get localSoundLevel(): number {
      return self.isStageMode
        ? self.agoraStageModeStore.localSoundLevel
        : self.agoraMeetingStore.localSoundLevel;
    }
  }));

export {AgoraStore};
