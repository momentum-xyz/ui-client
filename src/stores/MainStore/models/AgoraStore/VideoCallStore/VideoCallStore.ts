import {flow, types} from 'mobx-state-tree';
import AgoraRTC, {ILocalAudioTrack, ILocalVideoTrack} from 'agora-rtc-sdk-ng';

import {RequestModel, ResetModel} from 'core/models';
import {api} from 'api';

const VideoCallStore = types
  .compose(
    ResetModel,
    types.model('VideoCallStore', {
      appId: '',
      userId: types.maybe(types.string),
      spaceId: types.maybe(types.string),

      tokenRequest: types.optional(RequestModel, {}),
      muteRequest: types.optional(RequestModel, {}),
      muteAllRequest: types.optional(RequestModel, {})
    })
  )
  .volatile(() => ({
    client: AgoraRTC.createClient({mode: 'rtc', codec: 'h264'})
  }))
  .actions((self) => ({
    muteRemoteUser: flow(function* (userId: string) {
      if (!self.spaceId) {
        return;
      }

      yield self.muteRequest.send(api.communicationRepository.muteParticipant, {
        spaceId: self.spaceId,
        userId
      });
    }),
    muteAllRemoteUsers: flow(function* () {
      yield self.muteAllRequest.send(api.communicationRepository.muteAllParticipants, {
        spaceId: self.spaceId
      });
    })
  }))
  .actions((self) => ({
    init(appId: string) {
      self.client.enableAudioVolumeIndicator();
      self.appId = appId;
    },
    createVideoTrackAndPublish: flow(function* (deviceId: string, isTrackEnabled: boolean) {
      if (self.client.connectionState !== 'CONNECTED') {
        return undefined;
      }

      const publishedCameraTrack = yield AgoraRTC.createCameraVideoTrack({
        cameraId: deviceId,
        facingMode: 'user',
        // https://docs.agora.io/en/Agora%20Platform/video_profile_web_ng?platform=Web#recommended-video-profiles
        encoderConfig: '240p_1'
      });

      yield self.client.publish(publishedCameraTrack);
      yield publishedCameraTrack.setEnabled(isTrackEnabled);

      return publishedCameraTrack;
    }),
    createAudioTrackAndPublish: flow(function* (deviceId: string, isTrackEnabled: boolean) {
      if (self.client.connectionState !== 'CONNECTED') {
        return undefined;
      }

      const publishedAudioTrack = yield AgoraRTC.createMicrophoneAudioTrack({
        microphoneId: deviceId
      });

      yield self.client.publish(publishedAudioTrack);
      publishedAudioTrack.setEnabled(isTrackEnabled);

      return publishedAudioTrack;
    }),
    clanupListeners() {
      self.client.removeAllListeners();
    },
    getAgoraToken: flow(function* (spaceId?: string) {
      const tokenResponse: string = yield self.tokenRequest.send(
        api.agoraRepository.getAgoraToken,
        {
          spaceId: spaceId ?? self.spaceId,
          isStageMode: false
        }
      );

      return tokenResponse;
    })
  }))
  .actions((self) => ({
    join: flow(function* (
      spaceId: string,
      authStateSubject: string,
      createLocalTracks: (
        createAudioTrack: (
          deviceId: string,
          isTrackEnabled: boolean
        ) => Promise<ILocalAudioTrack | undefined>,
        createVideoTrack: (
          deviceId: string,
          isTrackEnabled: boolean
        ) => Promise<ILocalVideoTrack | undefined>
      ) => void
    ) {
      const tokenResponse = yield self.getAgoraToken(spaceId);
      self.userId = yield self.client.join(self.appId, spaceId, tokenResponse, authStateSubject);
      createLocalTracks(self.createAudioTrackAndPublish, self.createVideoTrackAndPublish);
      self.spaceId = spaceId;
    }),
    leave: flow(function* () {
      yield self.client.leave();
      self.spaceId = undefined;
    })
  }))
  .views((self) => ({
    get joined(): boolean {
      return self.spaceId !== undefined;
    }
  }));

export {VideoCallStore};
