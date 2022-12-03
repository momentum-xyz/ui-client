import {RequestModel} from '@momentum-xyz/core';
import {IAgoraRTCRemoteUser, IRemoteAudioTrack, IRemoteVideoTrack} from 'agora-rtc-sdk-ng';
import {flow, Instance, types} from 'mobx-state-tree';
import {ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {api, FetchUserResponse, UserProfileInterface} from 'api';
import {appVariables} from 'api/constants';

const AgoraRemoteUser = types
  .model('AgoraRemoteUser', {
    uid: types.union(types.string, types.number),
    soundLevel: types.maybe(types.number),
    isMuted: types.boolean,
    cameraOff: types.boolean,
    name: types.maybe(types.string),
    profile: types.maybe(types.frozen<UserProfileInterface>()),
    request: types.optional(RequestModel, {})
  })
  .volatile<{participantInfo?: IAgoraRTCRemoteUser}>(() => ({}))
  .actions((self) => ({
    fetchUser: flow(function* () {
      const userId = self.uid.toString();

      const response: FetchUserResponse = yield self.request.send(api.userRepository.fetchUser, {
        userId
      });

      if (response) {
        self.profile = response.profile;
        self.name = response.name;
      }
    })
  }))
  .views((self) => ({
    get audioTrack(): IRemoteAudioTrack | undefined {
      return self.participantInfo?.audioTrack;
    },
    set audioTrack(track: IRemoteAudioTrack | undefined) {
      if (self.participantInfo) {
        self.participantInfo = {
          ...self.participantInfo,
          audioTrack: track
        };
      }
    },
    get videoTrack(): IRemoteVideoTrack | undefined {
      return self.participantInfo?.videoTrack;
    },
    set videoTrack(track: IRemoteVideoTrack | undefined) {
      if (self.participantInfo) {
        self.participantInfo = {
          ...self.participantInfo,
          videoTrack: track
        };
      }
    },
    get avatarSrc(): string | undefined {
      return (
        self.profile?.avatarHash &&
        `${appVariables.RENDER_SERVICE_URL}/texture/${ImageSizeEnum.S3}/${self.profile.avatarHash}`
      );
    }
  }));

export interface AgoraRemoteUserInterface extends Instance<typeof AgoraRemoteUser> {}

export {AgoraRemoteUser};
