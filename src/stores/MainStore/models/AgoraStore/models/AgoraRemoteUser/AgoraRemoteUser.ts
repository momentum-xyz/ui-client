import {IAgoraRTCRemoteUser, IRemoteAudioTrack, IRemoteVideoTrack} from 'agora-rtc-sdk-ng';
import {Instance, types} from 'mobx-state-tree';

const AgoraRemoteUser = types
  .model('AgoraRemoteUser', {
    uid: types.union(types.string, types.number),
    soundLevel: types.maybe(types.number),
    isMuted: types.boolean,
    cameraOff: types.boolean
  })
  .volatile<{participantInfo?: IAgoraRTCRemoteUser}>(() => ({}))
  .views((self) => ({
    get audioTrack(): IRemoteAudioTrack | undefined {
      return self.participantInfo?.audioTrack;
    },
    set audioTrack(track: IRemoteAudioTrack | undefined) {
      if (self.participantInfo) {
        self.participantInfo.audioTrack = track;
      }
    },
    get hasAudio(): boolean {
      return self.participantInfo?.hasAudio ?? false;
    },
    get videoTrack(): IRemoteVideoTrack | undefined {
      return self.participantInfo?.videoTrack;
    },
    set videoTrack(track: IRemoteVideoTrack | undefined) {
      if (self.participantInfo) {
        self.participantInfo.videoTrack = track;
      }
    },
    get hasVideo(): boolean {
      return self.participantInfo?.hasVideo ?? false;
    }
  }));

export interface AgoraRemoteUserInterface extends Instance<typeof AgoraRemoteUser> {}

export {AgoraRemoteUser};
