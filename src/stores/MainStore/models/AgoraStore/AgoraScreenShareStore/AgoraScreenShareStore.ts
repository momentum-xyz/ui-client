import {flow, types} from 'mobx-state-tree';
import AgoraRTC, {
  IAgoraRTCClient,
  IRemoteVideoTrack,
  ScreenVideoTrackInitConfig
} from 'agora-rtc-sdk-ng';

import {api} from 'api';
import {RequestModel, ResetModel} from 'core/models';

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
      spaceId: types.maybe(types.string),
      appId: '',
      isStageMode: false
    })
  )
  .volatile<{client?: IAgoraRTCClient; videoTrack?: IRemoteVideoTrack}>(() => ({
    client: undefined,
    videoTrack: undefined
  }))
  .actions((self) => ({
    init(appId: string, isStageMode: boolean, spaceId?: string) {
      self.appId = appId;
      self.spaceId = spaceId;
      self.isStageMode = isStageMode;
    },
    stopScreenShare() {
      self.client?.localTracks.forEach((track) => {
        track.close();
      });
      self.client?.leave();
      self.client = undefined;
      self.videoTrack = undefined;
    },
    screenShareStopped() {
      self.videoTrack = undefined;
    },
    screenShareStarted(screenShare: IRemoteVideoTrack) {
      self.videoTrack = screenShare;
    }
  }))
  .actions((self) => ({
    createScreenTrackAndPublish: flow(function* () {
      if (self.client) {
        const screenTrack = yield AgoraRTC.createScreenVideoTrack(TRACK_CONFIG, 'disable');
        yield self.client.publish(screenTrack);
        screenTrack.on('track-ended', self.stopScreenShare);
      }
    })
  }))
  .actions((self) => ({
    startScreenShare: flow(function* (authStateSubject: string) {
      if (self.spaceId) {
        self.client = AgoraRTC.createClient({
          mode: self.isStageMode ? 'live' : 'rtc',
          codec: 'h264'
        });

        if (self.isStageMode) {
          yield self.client.setClientRole('host');
        }

        const response: string = yield self.request.send(
          api.agoraRepository.getAgoraScreenShareToken,
          {
            spaceId: self.spaceId,
            isStageMode: self.isStageMode
          }
        );

        const token = self.isStageMode ? `stage-${self.spaceId}` : self.spaceId;
        yield self.client.join(self.appId, token, response, `ss|${authStateSubject}`);
        yield self.createScreenTrackAndPublish();
      }
    })
  }));

export {AgoraScreenShareStore};
