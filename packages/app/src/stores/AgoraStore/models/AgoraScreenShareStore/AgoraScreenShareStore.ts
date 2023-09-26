import {flow, Instance, types} from 'mobx-state-tree';
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ILocalVideoTrack,
  IRemoteVideoTrack,
  ScreenVideoTrackInitConfig
} from 'agora-rtc-sdk-ng';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {AgoraTokenResponse, api} from 'api';
import {appVariables} from 'api/constants';

const TRACK_CONFIG: ScreenVideoTrackInitConfig = {
  encoderConfig: {
    width: {max: 1280},
    height: {max: 720},
    frameRate: {max: 30},
    bitrateMax: 2000
  }
};

const AgoraScreenShareStore = types
  .compose(
    ResetModel,
    types.model('AgoraScreenShareStore', {
      request: types.optional(RequestModel, {}),
      worldId: types.maybe(types.string),
      appId: '',
      isSettingUp: false
    })
  )
  .volatile<{
    client: IAgoraRTCClient;
    _remoteVideoTrack?: IRemoteVideoTrack;
    _localVideoTrack?: ILocalVideoTrack;
  }>(() => ({
    client: AgoraRTC.createClient({
      mode: 'rtc',
      codec: 'h264'
    }),
    _remoteVideoTrack: undefined,
    _localVideoTrack: undefined
  }))
  .views((self) => ({
    get remoteVideoTrack(): IRemoteVideoTrack | undefined {
      return self._remoteVideoTrack;
    },
    set remoteVideoTrack(track: IRemoteVideoTrack | undefined) {
      self._remoteVideoTrack = track;
    },
    get localVideoTrack(): ILocalVideoTrack | undefined {
      return self._localVideoTrack;
    },
    set localVideoTrack(track: ILocalVideoTrack | undefined) {
      self._localVideoTrack = track;
    }
  }))
  .actions((self) => ({
    handleUserPublished: flow(function* (
      user: IAgoraRTCRemoteUser,
      mediaType: 'audio' | 'video',
      callback: () => void
    ) {
      yield self.client.subscribe(user, mediaType);

      self.remoteVideoTrack = user.videoTrack;
      callback();
    }),
    handleUserUnpublished() {
      self.remoteVideoTrack?.stop();
      self.remoteVideoTrack = undefined;
    }
  }))
  .actions((self) => ({
    init(worldId: string, userId: string, onUserPublished: () => void) {
      self.appId = appVariables.AGORA_APP_ID;
      self.worldId = worldId;
      this.setupAgoraListeners(onUserPublished);
      self.openScreenShare(userId);
    },
    setupAgoraListeners(onUserPublished: () => void) {
      self.client.on('user-published', (user, mediaType) =>
        self.handleUserPublished(user, mediaType, onUserPublished)
      );
      self.client.on('user-unpublished', self.handleUserUnpublished);
    },
    cleanupListeners() {
      self.client.removeAllListeners();
    }
  }))
  .actions((self) => ({
    leave() {
      self.client?.localTracks.forEach((track) => {
        track.close();
      });
      self.client.unpublish();
      self.localVideoTrack = undefined;
    }
  }))
  .actions((self) => ({
    createScreenTrackAndPublish: flow(function* () {
      if (self.client) {
        const screenTrack: ILocalVideoTrack = yield AgoraRTC.createScreenVideoTrack(
          TRACK_CONFIG,
          'disable'
        );
        yield self.client.publish(screenTrack);
        self.localVideoTrack = screenTrack;
        screenTrack.on('track-ended', self.leave);
      }
    }),
    close() {
      self.client?.localTracks.forEach((track) => {
        track.close();
      });
      self.client.unpublish();
      self.localVideoTrack = undefined;
    }
  }))
  .actions((self) => ({
    openScreenShare: flow(function* (authStateSubject: string) {
      if (self.worldId) {
        const {token, channel}: AgoraTokenResponse = yield self.request.send(
          api.agoraRepository.getAgoraToken,
          {
            objectId: self.worldId,
            screenshare: true
          }
        );

        yield self.client.join(self.appId, channel, token, authStateSubject);
      }
    }),
    startScreenSharing: flow(function* () {
      self.isSettingUp = true;

      try {
        yield self.createScreenTrackAndPublish();
      } catch (e) {
        self.client.leave();
      } finally {
        self.isSettingUp = false;
      }
    })
  }));

export type AgoraScreenShareStoreType = Instance<typeof AgoraScreenShareStore>;

export {AgoraScreenShareStore};
