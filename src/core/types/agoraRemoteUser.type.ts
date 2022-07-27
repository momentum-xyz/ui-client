import {IAgoraRTCRemoteUser} from 'agora-rtc-sdk-ng';

export declare interface AgoraRemoteUserType extends IAgoraRTCRemoteUser {
  soundLevel?: number;
  isMuted?: boolean;
  cameraOff?: boolean;
}
