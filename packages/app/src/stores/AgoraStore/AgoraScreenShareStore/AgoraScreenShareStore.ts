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
  .volatile<{client?: IAgoraRTCClient; _videoTrack?: IRemoteVideoTrack}>(() => ({
    client: undefined,
    _videoTrack: undefined
  }))
  .views((self) => ({
    get videoTrack(): IRemoteVideoTrack | undefined {
      return self._videoTrack;
    },
    set videoTrack(track: IRemoteVideoTrack | undefined) {
      self._videoTrack = track;
    }
  }))
  .actions((self) => ({
    handleUserPublished(user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') {
      self.videoTrack = user.videoTrack;
    },
    handleUserUnpublished(user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') {
      self.videoTrack = undefined;
    }
  }))
  .actions((self) => ({
    init(worldId?: string) {
      self.appId = appVariables.AGORA_APP_ID;
      self.worldId = worldId;
    }
  }))
  .actions((self) => ({
    leave() {
      self.client?.localTracks.forEach((track) => {
        track.close();
      });
      self.client?.leave();
      self.client = undefined;
      self.videoTrack = undefined;
    }
  }))
  .actions((self) => ({
    createScreenTrackAndPublish: flow(function* () {
      console.info('Client2', self.client);
      if (self.client) {
        console.info('Client3', self.client);
        const screenTrack: ILocalVideoTrack = yield AgoraRTC.createScreenVideoTrack(
          TRACK_CONFIG,
          'disable'
        );
        yield self.client.publish(screenTrack);
        screenTrack.on('track-ended', self.leave);
      }
    })
  }))
  .actions((self) => ({
    startScreenSharing: flow(function* (authStateSubject: string) {
      let wasStarted = false;

      if (self.worldId) {
        self.isSettingUp = true;
        //self.isStageMode ? 'live' :
        self.client = AgoraRTC.createClient({
          mode: 'rtc',
          codec: 'h264'
        });

        console.info('first client', self.client);
        // if (self.isStageMode) {
        //   yield self.client.setClientRole('host');
        // }

        const {token}: AgoraTokenResponse = yield self.request.send(
          api.agoraRepository.getAgoraToken,
          {
            spaceId: self.worldId
          }
        );

        try {
          yield self.client.join(self.appId, self.worldId, token, `ss|${authStateSubject}`);
          yield self.createScreenTrackAndPublish();
          wasStarted = true;
        } catch (e) {
          console.info(e);
          self.client.leave();
        } finally {
          self.isSettingUp = false;
        }
      }

      return wasStarted;
    }),
    stopScreenSharing() {
      if (!self.videoTrack) {
        return;
      }

      self.videoTrack.stop();
      self.videoTrack = undefined;

      self.client?.localTracks.forEach((track) => {
        track.close();
      });
      self.client?.leave();
      self.client = undefined;
    }
  }));

export type AgoraScreenShareStoreType = Instance<typeof AgoraScreenShareStore>;

export {AgoraScreenShareStore};
