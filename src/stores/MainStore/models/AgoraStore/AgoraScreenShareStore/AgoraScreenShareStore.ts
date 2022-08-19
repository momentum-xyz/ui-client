import {flow, types} from 'mobx-state-tree';
import AgoraRTC, {
  ConnectionDisconnectedReason,
  ConnectionState,
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ILocalVideoTrack,
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
      isStageMode: false,
      connectionState: types.optional(types.frozen<ConnectionState>(), 'DISCONNECTED')
    })
  )
  .volatile<{client?: IAgoraRTCClient; videoTrack?: IRemoteVideoTrack | ILocalVideoTrack}>(() => ({
    client: undefined,
    videoTrack: undefined
  }))
  .actions((self) => ({
    init(appId: string, isStageMode: boolean, spaceId?: string) {
      self.appId = appId;
      self.spaceId = spaceId;
      self.isStageMode = isStageMode;
    }
  }))
  // Listeners handlers
  .actions((self) => ({
    handleUserPublished: flow(function* (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') {
      if ((user?.uid as string).split('|')[0] !== 'ss' || !self.client) {
        return;
      }

      yield self.client?.subscribe(user, mediaType);
      if (user.videoTrack) {
        self.videoTrack = user.videoTrack;
      }
    }),
    handleUserUnpublished(user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') {
      if ((user?.uid as string).split('|')[0] !== 'ss') {
        return;
      }

      self.videoTrack = undefined;
    },
    handleUserLeft(user: IAgoraRTCRemoteUser) {
      if ((user.uid as string).split('|')[0] !== 'ss') {
        return;
      }
      self.videoTrack = undefined;
    },
    handleConnectionStateChange(
      currentState: ConnectionState,
      previousState: ConnectionState,
      reason?: ConnectionDisconnectedReason
    ) {
      self.connectionState = currentState;
    }
  }))
  // Listeners registration
  .actions((self) => ({
    setupAgoraListeners() {
      self.client?.on('user-published', self.handleUserPublished);
      self.client?.on('user-unpublished', self.handleUserPublished);
      self.client?.on('user-left', self.handleUserLeft);
      self.client?.on('connection-state-change', self.handleConnectionStateChange);
    },
    cleanupListeners() {
      self.client?.removeAllListeners();
    }
  }))
  .actions((self) => ({
    leave() {
      self.client?.localTracks.forEach((track) => {
        track.close();
      });
      self.client?.leave();
      self.cleanupListeners();
      self.client = undefined;
      self.videoTrack = undefined;
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
        screenTrack.on('track-ended', self.leave);

        return screenTrack;
      }

      return undefined;
    })
  }))
  .actions((self) => ({
    join: flow(function* (authStateSubject: string) {
      if (self.spaceId) {
        self.client = AgoraRTC.createClient({
          mode: self.isStageMode ? 'live' : 'rtc',
          codec: 'h264'
        });

        self.setupAgoraListeners();

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
      }
    }),
    startScreenSharing: flow(function* () {
      const screenTrack = yield self.createScreenTrackAndPublish();

      if (screenTrack) {
        self.videoTrack = screenTrack;
      }
    }),
    stopScreenSharing() {
      if (!self.videoTrack) {
        return;
      }

      self.videoTrack.stop();

      // ILocalVideoTrack doesn't have close method
      if ('close' in self.videoTrack) {
        self.videoTrack.close();
      }

      self.videoTrack = undefined;
    }
  }));

export {AgoraScreenShareStore};
