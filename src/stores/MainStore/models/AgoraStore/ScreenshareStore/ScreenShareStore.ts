import {flow, types} from 'mobx-state-tree';
import AgoraRTC, {IAgoraRTCClient, IRemoteVideoTrack} from 'agora-rtc-sdk-ng';

import {RequestModel, ResetModel} from 'core/models';
import {api} from 'api';

const ScreenShareStore = types
  .compose(
    ResetModel,
    types.model('ScreenShareStore', {
      spaceId: types.maybe(types.string),
      appId: '',
      isStageMode: false,

      screenShareTokenRequest: types.optional(RequestModel, {})
    })
  )
  .volatile<{client?: IAgoraRTCClient; _screenShare?: IRemoteVideoTrack}>(() => ({}))
  .views((self) => ({
    get screenShare(): IRemoteVideoTrack | undefined {
      return self._screenShare;
    },
    set screenShare(value: IRemoteVideoTrack | undefined) {
      self._screenShare = value;
    }
  }))
  // Track actions
  .actions((self) => ({
    createScreenTrackAndPublish: flow(function* () {
      if (!self.client) {
        return undefined;
      }

      const screenTrack = yield AgoraRTC.createScreenVideoTrack(
        {
          encoderConfig: {
            width: {
              max: 1280
            },
            height: {
              max: 720
            },
            frameRate: {
              max: 30
            },
            bitrateMax: 2000
          }
        },
        'disable'
      );

      yield self.client.publish(screenTrack);
      return screenTrack;
    })
  }))
  // State actions
  .actions((self) => ({
    init(appId: string, isStageMode: boolean, spaceId: string) {
      self.client = AgoraRTC.createClient({
        mode: isStageMode ? 'live' : 'rtc',
        codec: 'h264'
      });

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
      self.screenShare = undefined;
    },
    startScreenShare: flow(function* (authStateSubject: string) {
      if (self.spaceId) {
        self.client = AgoraRTC.createClient({
          mode: self.isStageMode ? 'live' : 'rtc',
          codec: 'h264'
        });

        if (self.isStageMode) {
          yield self.client.setClientRole('host');
        }

        const response: string = yield self.screenShareTokenRequest.send(
          api.agoraRepository.getAgoraScreenShareToken,
          {
            spaceId: self.spaceId,
            isStageMode: self.isStageMode
          }
        );

        yield self.client.join(
          self.appId,
          self.isStageMode ? 'stage-' + self.spaceId : self.spaceId,
          response,
          'ss|' + authStateSubject
        );

        yield self.createScreenTrackAndPublish();
      }
    }),
    screenShareStopped() {
      self.screenShare = undefined;
    },
    screenShareStarted(screenShare: IRemoteVideoTrack) {
      self.screenShare = screenShare;
    }
  }));

export {ScreenShareStore};
