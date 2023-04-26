import {Instance, types} from 'mobx-state-tree';
import {IAgoraRTCRemoteUser, IRemoteAudioTrack, IRemoteVideoTrack} from 'agora-rtc-sdk-ng';

const AgoraRemoteUser = types
  .model('AgoraRemoteUser', {
    uid: types.union(types.string, types.number),
    soundLevel: 0,
    isMuted: true
  })
  .volatile<{agoraRTCUser?: IAgoraRTCRemoteUser}>(() => ({}))
  .actions((self) => ({
    setIsMuted(isMuted: boolean) {
      self.isMuted = isMuted;
    },
    setSoundLevel(soundLevel: number) {
      self.soundLevel = soundLevel;
    }
  }))
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
