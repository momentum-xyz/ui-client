import {Instance, types} from 'mobx-state-tree';
import {IAgoraRTCRemoteUser, IRemoteAudioTrack, IRemoteVideoTrack} from 'agora-rtc-sdk-ng';

const AgoraRemoteUser = types
  .model('AgoraRemoteUser', {
    uid: types.union(types.string, types.number),
    soundLevel: types.maybe(types.number),
    isMuted: types.boolean
  })
  .volatile<{agoraRTCUser?: IAgoraRTCRemoteUser}>(() => ({}))
  .views((self) => ({
    get audioTrack(): IRemoteAudioTrack | undefined {
      return self.agoraRTCUser?.audioTrack;
    },
    set audioTrack(track: IRemoteAudioTrack | undefined) {
      if (self.agoraRTCUser) {
        self.agoraRTCUser = {
          ...self.agoraRTCUser,
          audioTrack: track
        };
      }
    },
    get videoTrack(): IRemoteVideoTrack | undefined {
      return self.agoraRTCUser?.videoTrack;
    },
    set videoTrack(track: IRemoteVideoTrack | undefined) {
      if (self.agoraRTCUser) {
        self.agoraRTCUser = {
          ...self.agoraRTCUser,
          videoTrack: track
        };
      }
    }
  }));

export interface AgoraRemoteUserInterface extends Instance<typeof AgoraRemoteUser> {}

export {AgoraRemoteUser};
